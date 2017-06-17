const Model = require('../../lib/facade');
const contextSchema  = require('./context-schema');

class ContextModel extends Model {}

module.exports = new ContextModel(contextSchema);
