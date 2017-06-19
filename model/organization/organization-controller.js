const Controller = require('../../lib/controller');
const organizationFacade  = require('./organization-facade');
const userController = require('./../user/user-controller');
class OrganizationController extends Controller {}

OrganizationController.prototype.create = (req, res, next) => {
  organizationFacade.create(req.body).then((org) => {
    const user = {
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

    req.body = user;

    userController.create(req, res, next);
  }).catch(err => next(err));
};

module.exports = new OrganizationController(organizationFacade);
