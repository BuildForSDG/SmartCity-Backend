const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: String,
  name: {
    type: String,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    maxlength: 6
  },
  discountedPrice: {
    type: Number,
    maxlength: 6
  },
  filename: String,
  categoryId: String,
  sellerId: String,
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

const Product = mongoose.model('products', productSchema);

module.exports = Product;
