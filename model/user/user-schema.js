const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const crypto   = require('./../../lib/crypto');

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email:  { type: String, trim: true, lowercase: true, required: true },
  password:  { type: String, required: true },
  photoUrl:  { type: String, required: true, default: 'https://image.ibb.co/gFugYQ/nophoto.png' },
  organization:  { type: Schema.Types.ObjectId, ref: 'Organization', autopopulate: true, required: true },
  permissions: [{
    app: { type: Schema.Types.ObjectId, ref: 'Application', autopopulate: true, required: true },
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

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  user.password = crypto.encrypt(user.password);
  next();
});

userSchema.methods.passwordVerify = function(passToCheck) {
  return crypto.decrypt(passToCheck) === this.password;
};

userSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('User', userSchema);
