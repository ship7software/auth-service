const Controller = require('../../lib/controller');
const organizationFacade  = require('./organization-facade');
const userFacade = require('./../user/user-facade');
// const ObjectId = require('mongoose').Schema.Types.ObjectId;
class OrganizationController extends Controller {}

OrganizationController.prototype.register = (req, res, next) => {
  organizationFacade.create(req.body).then((org) => {
    const newUser = {
      name: org.sponsorName,
      email: org.email,
      password: req.body.password,
      organization: org._id,
      permissions: [{
        app: req.application._id,
        allowed: [{ path: '*', write: true }]
      }]
    };
    console.log(newUser);
    userFacade.create(newUser).then((user) => {
      res.status(201).send(user);
    }).catch((err) => {
      organizationFacade.remove(org._id);
      next(err);
    });
  }).catch(err => next(err));
};

module.exports = new OrganizationController(organizationFacade);
