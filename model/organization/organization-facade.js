const Model = require('ship7-api-lib').Facade;
const organizationSchema  = require('./organization-schema');

class OrganizationModel extends Model {}

module.exports = new OrganizationModel(organizationSchema);
