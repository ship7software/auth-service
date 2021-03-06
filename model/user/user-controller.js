const Controller = require('ship7-api-lib').Controller;
const userFacade  = require('./user-facade');
const jwt = require('jsonwebtoken');
const Mail = require('ship7-api-lib').Mail;
const organizationFacade = require('./../organization/organization-facade');
const url = require('url');

function sendConfirmation(user, context, config) {
  const token = jwt.sign({
    email: user.email
  }, config.privateKey, { expiresIn: '2d' });

  const mail = new Mail('ship7-auth-confirmation', user.email, {
    applicationName: context.appName,
    applicationLogo: context.logoUrl,
    sponsorName: user.name,
    confirmationLink: url.resolve(context.frontendUrlBase, `/confirmation?token=${token}`)
  });

  mail.send();

  return token;
}

function sendPasswordReset(user, context, config) {
  const token = jwt.sign({
    email: user.email
  }, config.privateKey, { expiresIn: '2d' });

  const mail = new Mail('ship7-auth-passwordReset', user.email, {
    applicationName: context.appName,
    applicationLogo: context.logoUrl,
    sponsorName: user.name,
    resetLink: url.resolve(context.frontendUrlBase, `/passwordReset?token=${token}`)
  });

  mail.send();

  return token;
}

function auth(user, req, res) {
  const perfil = {
    id: user._id,
    name: user.name,
    email: user.email,
    organization: user.organization,
    permissions: user.permissions,
    confirmationToken: user.confirmationToken,
    photoUrl: user.photoUrl
  };

  perfil.token = jwt.sign(perfil, req.app.get('config').privateKey, { expiresIn: '8h' });
  perfil.redirectUrl = url.resolve(req.context.frontendUrlBase, `?token=${perfil.token}`);

  res.status(200).json(perfil);
}

class UserController extends Controller {}

UserController.prototype.auth = (req, res, next) => {
  userFacade.findOne({ email: req.body.email }).then((user) => {
    if (!user || !user.verifyPassword(req.body.password)) {
      res.status(401).json({ code: 'INVALID_CREDENTIALS' });
    } else {
      auth(user, req, res);
    }
  });
};

UserController.prototype.create = (req, res, next) => {
  userFacade.find({ organization: req.body.organization }).then((orgUsers) => {
    userFacade.create(req.body).then((user) => {
      user.confirmationToken = sendConfirmation(user, req.context, req.app.get('config'));
      auth(user, req, res);
    }).catch((err) => {
      if (!orgUsers || orgUsers.length === 0) {
        organizationFacade.remove(req.body.organization);
      }
      next(err);
    });
  });
};

UserController.prototype.confirm = (req, res, next) => {
  jwt.verify(req.body.token, req.app.get('config').privateKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ code: 'INVALID_OR_EXPIRED_TOKEN' });
      return;
    }

    userFacade.findOne({ email: decoded.email }).then((user) => {
      userFacade.update({ email: decoded.email }, { confirmed: true }).then(auth(user, req, res));
    });
  });
};

UserController.prototype.verifyPasswordReset = (req, res, next) => {
  jwt.verify(req.body.token, req.app.get('config').privateKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ code: 'INVALID_OR_EXPIRED_TOKEN' });
      return;
    }

    res.status(200).json({ email: decoded.email });
  });
};

UserController.prototype.passwordReset = (req, res, next) => {
  jwt.verify(req.body.token, req.app.get('config').privateKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ code: 'INVALID_OR_EXPIRED_TOKEN' });
      return;
    }

    if (!req.body.password || req.body.password !== req.body.passwordConfirm) {
      res.status(400).json({ message: 'Preencha os campos de senha corretamente!' });
      return;
    }

    userFacade.findOne({ email: decoded.email }).then((user) => {
      const conditions = { email: decoded.email };
      const payload = { password: req.body.password };

      userFacade.update(conditions, payload).then(auth(user, req, res));
    });
  });
};

UserController.prototype.sendConfirmation = (req, res, next) => {
  userFacade.findOne({ email: req.body.email }).then((user) => {
    let confirmationToken = null;
    if (user) {
      confirmationToken = sendConfirmation(user, req.context, req.app.get('config'));
    }
    res.status(200).json({ confirmationToken });
  });
};

UserController.prototype.sendPasswordReset = (req, res, next) => {
  userFacade.findOne({ email: req.body.email }).then((user) => {
    let passwordResetToken = null;
    if (user) {
      passwordResetToken = sendPasswordReset(user, req.context, req.app.get('config'));
    }
    res.status(200).json({ passwordResetToken });
  });
};

module.exports = new UserController(userFacade);
