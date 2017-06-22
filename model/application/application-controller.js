const Controller = require('ship7-api-lib').Controller;
const applicationFacade  = require('./application-facade');

class ApplicationController extends Controller {}

module.exports = new ApplicationController(applicationFacade);
