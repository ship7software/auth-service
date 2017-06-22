const Model = require('ship7-api-lib').Facade;
const userSchema  = require('./user-schema');

class UserModel extends Model {}

module.exports = new UserModel(userSchema);
