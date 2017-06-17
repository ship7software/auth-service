const whiteList = [
  { method: '*', path: '/application' },
  { method: '*', path: '/context' },
  { method: 'POST', path: '/organization' },
  { method: 'POST', path: '/auth' }
];

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const userController = require('./../model/user/user-controller');

module.exports = {
  verify: (req, res, next) => {
    const urlAccess = req.query.path || req.body.path || req.url;
    const isInWhiteList = _(whiteList).some(obj =>
      (obj.method === '*' || obj.method === req.method) && (obj.path === '*' || obj.path === urlAccess)
    );

    if (!isInWhiteList) {
      const providedToken = req.headers.authorization || req.query.token || req.body.token;

      if (!providedToken) {
        res.status(401).send({ code: 'INVALID_TOKEN' });
      } else {
        const tokenParts = providedToken.split(' ');

        if (tokenParts.length !== 2) {
          res.status(401).send({ code: 'INVALID_TOKEN' });
        } else {
          jwt.verify(tokenParts[1], req.app.get('config').privateKey, (err, decoded) => {
            if (err) {
              res.status(401).json({ code: 'INVALID_OR_EXPIRED_TOKEN' });
              return;
            }

            req.token = tokenParts[1];
            req.user = decoded;
            next();
          });
        }
      }
    } else {
      next();
    }
  },
  login: userController.auth,
  perfil: (req, res, next) => {
    res.status(200).send(req.user);
  }
};
