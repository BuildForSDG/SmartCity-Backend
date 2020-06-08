const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // _id: String,
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

const User = mongoose.model('User', userSchema);

module.exports = User;
