const Model = require('../../lib/facade');
const organizationSchema  = require('./organization-schema');

class OrganizationModel extends Model {}

module.exports = new OrganizationModel(organizationSchema);
