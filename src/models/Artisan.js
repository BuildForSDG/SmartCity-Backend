const mongoose = require('mongoose');

const artisanSchema = mongoose.Schema({
  _id: String,
  name: {
    type: String,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true
  },
  filename: String,
  fieldId: String,
  location: String,
  reviews: [
    {
      writer: String,
      body: String,
      date: { type: Date, default: Date.now },
      rating: Number
    }
  ],
  datePosted: { type: Date, default: Date.now }
});

const Artisan = mongoose.model('artisans', artisanSchema);

module.exports = Artisan;
