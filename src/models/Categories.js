const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  _id: Number,
  name: String
});
const Category = mongoose.model('categories', categorySchema);
module.exports = Category;
