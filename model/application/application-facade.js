const Model = require('ship7-api-lib').Facade;
const applicationSchema  = require('./application-schema');

class ApplicationModel extends Model {}

module.exports = new ApplicationModel(applicationSchema);
