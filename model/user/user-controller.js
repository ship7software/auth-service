const Controller = require('../../lib/controller');
const userFacade  = require('./user-facade');
const jwt = require('jsonwebtoken');
const mail = require('./../../lib/mail');
const organizationFacade = require('./../organization/organization-facade');
const { URL } = require('url');

function sendConfirmation(user, context, config) {
  const token = jwt.sign({
    email: user.email
  }, config.privateKey, { expiresIn: '2d' });

  mail.send(config.mail.from, user.email, `${context.appName} - Confirmação de Email`, 'accountConfirmation.html', {
    applicationName: context.appName,
    applicationLogo: context.logoUrl,
    sponsorName: user.name,
    confirmationLink: new URL(`/confirmation?token=${token}`, context.frontendUrlBase).href
  }, config.mail.smtp);

  return token;
}

function sendPasswordReset(user, context, config) {
  const token = jwt.sign({
    email: user.email
  }, config.privateKey, { expiresIn: '2d' });

  mail.send(config.mail.from, user.email, `${context.appName} - Redefinição de Senha`, 'passwordReset.html', {
    applicationName: context.appName,
    applicationLogo: context.logoUrl,
    sponsorName: user.name,
    resetLink: new URL(`/passwordReset?token=${token}`, context.frontendUrlBase).href
  }, config.mail.smtp);

  return token;
}

function auth(user, req, res) {
  const perfil = {
    id: user._id,
    name: user.name,
    email: user.email,
    organization: user.organization,
    permissions: user.permissions,
    confirmationToken: user.confirmationToken
  };

  perfil.token = jwt.sign(perfil, req.app.get('config').privateKey, { expiresIn: '8h' });

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
      res.status(400).json({ message: 'INVALID_DATA' });
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
