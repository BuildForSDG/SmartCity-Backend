const mongoose = require('mongoose');

const reviewsSchema = mongoose.Schema(
  {
    writer: String,
    body: String,
    date: { type: Date, default: Date.now },
    rating: Number
  }
);
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
  categoryId: String,
  location: String,
  reviews: [
    reviewsSchema
  ],
  datePosted: { type: Date, default: Date.now }
});

const Artisan = mongoose.model('artisans', artisanSchema);

module.exports = Artisan;
