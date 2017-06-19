const Controller = require('../../lib/controller');
const userFacade  = require('./user-facade');
const jwt = require('jsonwebtoken');
class UserController extends Controller {}

UserController.prototype.auth = (req, res, next) => {
  userFacade.findOne({ email: req.body.email }).then((user) => {
    if (!user || !user.verifyPassword(req.body.password)) {
      res.status(401).send({ code: 'INVALID_CREDENTIALS' });
    } else {
      const perfil = {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        permissions: user.permissions
      };

      perfil.token = jwt.sign(perfil, req.app.get('config').privateKey, { expiresIn: '8h' });

      res.status(200).send(perfil);
    }
  }).catch(err => next(err));
};

module.exports = new UserController(userFacade);
