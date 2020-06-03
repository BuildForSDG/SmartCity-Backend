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
  discounted_price: {
    type: Number,
    maxlength: 6
  },
  filename: String,
  category_id: String,
  seller_id: String,
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

productSchema.methods.findAll = (limit, cb) => {
  this.model('products')
    .find()
    .limit(parseFloat(limit))
    .sort('-datePosted')
    .select('name price _id description discounted_price filename datePosted location reviews')
    .exec((err, docs) => {
      if (err) return cb(err);
      return cb(null, docs);
    });
};

const Product = mongoose.model('products', productSchema);

module.exports = Product;
