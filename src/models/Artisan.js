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
  field_id: String,
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

artisanSchema.methods.findAll = (limit, cb) => {
  this.model('artisans')
    .find()
    .limit(parseFloat(limit))
    .sort('-datePosted')
    .exec((err, docs) => {
      if (err) return cb(err);
      return cb(null, docs);
    });
};

const Artisan = mongoose.model('artisans', artisanSchema);

module.exports = Artisan;
