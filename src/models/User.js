const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const userSchema = mongoose.Schema({
  _id: String,
  firstname: {
    type: String,
    maxlength: 50
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  phone: {
    type: Number,
    maxlength: 14
  },
  address1: {
    type: String,
    trim: true
  },
  address2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    trim: true
  },
  dob: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    minglength: 6
  },
  role: {
    type: Number,
    default: 0
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  filename: String
});

userSchema.pre('save', (next) => {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (error, salt) => {
      if (error) return next(error);
      return bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
