const mongoose = require('mongoose');
const md5 = require('md5');
const Schema   = mongoose.Schema;

const applicationSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true, unique: true },
  logoUrl:  { type: String },
  whiteLogoUrl:  { type: String },
  blackLogoUrl:  { type: String },
  frontendUrlBase: String,
  apiKey: {
    type: String,
    required: true,
    hide: true,
    default: () => md5(`@piK&y=${new Date().toISOString()}`)
  },
  authPage: {
    htmlDescription:  { type: String }
  }
});
applicationSchema.plugin(require('mongoose-unique-validator'));
applicationSchema.plugin(require('mongoose-hidden'));

module.exports = mongoose.model('Application', applicationSchema);
