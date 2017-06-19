const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const applicationSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true, unique: true },
  logoUrl:  { type: String },
  whiteLogoUrl:  { type: String },
  blackLogoUrl:  { type: String },
  frontendUrlBase: String,
  authPage: {
    htmlDescription:  { type: String },
    buttonBackgroundColor:  { type: String },
    buttonBorderColor:  { type: String },
    buttonBackgroundColorHover:  { type: String },
    buttonBorderColorHover:  { type: String },
    overlayColor:  { type: String },
    overlayImage:  { type: String }
  }
});

module.exports = mongoose.model('Application', applicationSchema);
