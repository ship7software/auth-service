const whiteList = [
  { method: '*', path: '/application' },
  { method: '*', path: '/context' },
  { method: 'POST', path: '/organization' },
  { method: 'POST', path: '/auth' }
];

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const userController = require('./../model/user/user-controller');

function isInWhiteList(req) {
  return req.originalUrl === '/' || _(whiteList).some(obj =>
    (obj.method === '*' || obj.method === req.method) && (obj.path === '*' || req.originalUrl.indexOf(obj.path) !== -1)
  );
}

function verifyToken(providedToken, req, res, next) {
  const tokenParts = providedToken.split(' ');

  jwt.verify(tokenParts[1], req.app.get('config').privateKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ code: 'INVALID_OR_EXPIRED_TOKEN' });
      return;
    }

    req.token = tokenParts[1];
    req.user = decoded;
    return next();
  });
}

function providedTokenIsValid(req, res, next) {
  const providedToken = req.headers.authorization || req.query.token || req.body.token;

  if (!providedToken || providedToken.indexOf(' ') === -1) {
    res.status(401).send({ code: 'INVALID_TOKEN' });
    return false;
  }

  return providedToken;
}

module.exports = {
  verify: (req, res, next) => {
    if (!isInWhiteList(req)) {
      const providedToken = providedTokenIsValid(req, res, next);
      if (providedToken) {
        return verifyToken(providedToken, req, res, next);
      }
    }
    return next();
  },
  login: userController.auth,
  perfil: (req, res, next) => {
    res.status(200).send(req.user);
  }
};
