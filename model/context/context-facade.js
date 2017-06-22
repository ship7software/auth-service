const Model = require('ship7-api-lib').Facade;
const contextSchema  = require('./context-schema');

class ContextModel extends Model {}

module.exports = new ContextModel(contextSchema);
