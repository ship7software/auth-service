const Controller = require('../../lib/controller');
const applicationFacade  = require('./application-facade');

class ApplicationController extends Controller {}

module.exports = new ApplicationController(applicationFacade);
