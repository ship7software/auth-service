const Controller = require('../../lib/controller');
const contextFacade  = require('./context-facade');

class ContextController extends Controller {}

module.exports = new ContextController(contextFacade);
