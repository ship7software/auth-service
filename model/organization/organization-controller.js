const Controller = require('../../lib/controller');
const organizationFacade  = require('./organization-facade');
const userFacade = require('./../user/user-facade');
// const ObjectId = require('mongoose').Schema.Types.ObjectId;
class OrganizationController extends Controller {}

OrganizationController.prototype.create = (req, res, next) => {
  organizationFacade.create(req.body).then((org) => {
    const newUser = {
      name: org.sponsorName,
      email: org.email,
      password: req.body.password,
      organization: org._id,
      isSponsor: true,
      permissions: [{
        appShortName: req.application.shortName,
        allowed: [{ path: '*', write: true }]
      }]
    };

    userFacade.create(newUser).then((user) => {
      res.status(201).send(user);
    }).catch((err) => {
      organizationFacade.remove(org._id);
      next(err);
    });
  }).catch(err => next(err));
};

module.exports = new OrganizationController(organizationFacade);
