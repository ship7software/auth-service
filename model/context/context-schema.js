const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const contextSchema = new Schema({
  hostname: { type: String, required: true },
  appShortName:  { type: String, required: true },
  defaultRedirect: { type: String }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

contextSchema.index({ app: 1, hostname: 1 }, { unique: true });

contextSchema.virtual('app', {
  ref: 'Application',
  localField: 'appShortName',
  foreignField: 'shortName',
  justOne: true,
  autopopulate: true
});

contextSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Context', contextSchema);
