const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const crypto   = require('ship7-api-lib').Crypto;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email:  { type: String, trim: true, lowercase: true, required: true },
  password:  { type: String, required: true },
  photoUrl:  { type: String, required: true, default: 'https://image.ibb.co/gFugYQ/nophoto.png' },
  organization:  { type: Schema.Types.ObjectId, ref: 'Organization', autopopulate: true, required: true },
  confirmed: Boolean,
  isSponsor: Boolean,
  permissions: [{
    appShortName: { type: String, required: true },
    allowed: [{
      path: { type: String, required: true },
      write: Boolean
    }],
    denied: [{
      path: { type: String, required: true }
    }]
  }]
});

userSchema.index({ organization: 1, email: 1 }, { unique: true });
userSchema.virtual('permissions.app', {
  ref: 'Application',
  localField: 'appShortName',
  foreignField: 'shortName',
  justOne: true,
  autopopulate: true
});

userSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = crypto.encrypt(user.password);
  }
  next();
});

userSchema.methods.verifyPassword = function(passToCheck) {
  passToCheck = passToCheck || '';
  return crypto.encrypt(passToCheck) === this.password;
};

userSchema.plugin(require('mongoose-autopopulate'));
userSchema.plugin(require('mongoose-unique-validator'));

module.exports = mongoose.model('User', userSchema);
