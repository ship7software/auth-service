const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const organizationSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email:  { type: String, trim: true, lowercase: true, required: true, unique: true },
  phone:  { type: String, trim: true, required: true },
  sponsorName: { type: String, required: true, trim: true },
  photoUrl: { type: String, required: true, default: 'https://maxcdn.icons8.com/Share/icon/Business//organization1600.png' }
});

organizationSchema.plugin(require('mongoose-unique-validator'));

module.exports = mongoose.model('Organization', organizationSchema);
