const Controller = require('ship7-api-lib').Controller;
const contextFacade  = require('./context-facade');

class ContextController extends Controller {}

module.exports = new ContextController(contextFacade);
