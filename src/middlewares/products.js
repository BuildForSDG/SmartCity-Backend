const Product = require('../models/Product');
const createError = require('http-errors');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const config = require('../config/keys');
var mongoose = require('mongoose');
var mongodb = require('mongodb');

exports.getAllProducts = function (req, res, next) {
  const { limit } = req.query;
  const product = new Product();
  product.findAll(limit, function (err, docs) {
    if (err) return res.status(400).send(err);
    res.status(200).json(docs);
  });
};

exports.soughtByPrice = function (req, res, next) {
  // /products/inRange/:from-:to
  const { limit } = req.query;
  const { from, to } = req.params;
  Product.find()
    .where('price')
    .gt(parseFloat(from))
    .lt(parseFloat(to))
    .limit(parseFloat(limit))
    // sort('review.rating')
    .sort('-datePosted')
    .select('name price _id description discounted_price filename datePosted location reviews')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      res.status(200).json(docs);
    });
};
exports.soughtByLocation = function (req, res, next) {
  // /products/inLocation/:location
  const { limit } = req.query;
  const { location } = req.params;
  Product.find()
    .limit(parseFloat(limit))
    .where('location')
    .equals(location)
    .sort('-datePosted')
    .select('name price _id description discounted_price filename datePosted location reviews')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      res.status(200).json(docs);
    });
};
exports.soughtByCategory = function (req, res, next) {
  // /products/inCategory/:category_id
  const { limit } = req.query;
  const { category_id } = req.params;
  Product.find()
    .limit(parseFloat(limit))
    .where('category_id')
    .equals(category_id)
    .sort('-datePosted')
    .select('name price _id description discounted_price filename datePosted location reviews')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      res.status(200).json(docs);
    });
};
exports.soughtByCategoryAndLocation = function (req, res, next) {
  // /products/inCategory/:category_id/inLocation/:location
  const { limit } = req.query;
  const { category_id, location } = req.params;
  Product.find()
    .limit(parseFloat(limit))
    .where('location')
    .equals(location)
    .where('category_id')
    .equals(category_id)
    .sort('-datePosted')
    .select('name price _id description discounted_price filename datePosted location reviews')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      res.status(200).json(docs);
    });
};

/*******************/
/* Single Products */
/*******************/
exports.getSingleProducts = function (req, res, next) {
  // /products/:product_id
  const { product_id } = req.params;
  Product.findById(product_id).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    res.status(200).json(doc);
  });
};
exports.getProductReview = function (req, res, next) {
  // /products/:product_id/reviews
  const { product_id } = req.params;
  Product.findById(product_id).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    res.status(200).json(doc.reviews);
  });
};
exports.postReview = function (req, res, next) {
  const { product_id } = req.params;
  var review = req.body;
  Product.findById(product_id, function (err, doc) {
    if (err) return res.status(400).send(err);
    doc.reviews.push(review);
    doc.save(function (err, doc) {
      if (err) return res.status(400).send(err);
      res.status(200).json(doc);
    });
  });
};

exports.saveProduct = function (req, res, next) {
  console.log(req.file);
  const product = new Product({
    _id: req.file.id,
    filename: req.file.filename,
    ...req.body
  });
  product.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, ...err });
    return res.status(200).send(doc);
  });
};

const validate = function (req) {
  const { name, description, price, discounted_price, category_id, seller_id, location } = req.body;

  return !!name && !!description && !!price && !!discounted_price && !!category_id && !!seller_id && !!location;
};
var storage = new GridFsStorage({
  url: config.mongoURI,
  options: { useUnifiedTopology: true },
  cache: 'sdg',
  file: (req, file) => {
    const product = new Product(req.body);
    return new Promise((resolve, reject) => {
      const valid = validate(req);
      if (!valid) return reject(createError(400, 'All fields are required'));

      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          metadata: product,
          id: product._id,
          bucketName: 'productUploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
exports.upload = multer({ storage: storage });

exports.getProductImage = function (req, res, next) {
  mongodb.MongoClient.connect(config.mongoURI, function (error, client) {
    if (error) res.status(400).send(error);
    console.log(client.db);
    var bucket = new mongodb.GridFSBucket(client.db(), {
      chunkSizeBytes: 1024,
      bucketName: 'productUploads'
    });
    client
      .db()
      .collection('productUploads.files')
      .find({ filename: req.params.filename }, (err, file) => {
        file.toArray(function (err, docs) {
          if (!docs.length) return res.status(400).send('No such file exists');
          bucket
            .openDownloadStreamByName(req.params.filename)
            .pipe(res)
            .on('error', function (error) {
              res.status(400).send(error);
            })
            .on('finish', function () {
              client.close(function (error, result) {
                console.log('done!');
                res.end();
              });
            });
        });
      });
  });
};

exports.deleteProductFile = function (req, res, next) {
  mongodb.MongoClient.connect(config.mongoURI, function (error, client) {
    if (error) res.status(400).send(error);
    var bucket = new mongodb.GridFSBucket(client.db(), {
      chunkSizeBytes: 1024,
      bucketName: 'productUploads'
    });
    const validId = mongoose.Types.ObjectId.isValid(req.params.product_id);
    if (!validId) return res.status(400).send('Invalid ObjectId');
    const id = mongoose.Types.ObjectId(req.params.product_id);
    client
      .db()
      .collection('productUploads.files')
      .find({ _id: id }, (err, file) => {
        file.toArray(function (err, docs) {
          if (!docs.length) return res.status(400).send('No such file exists');
          bucket.delete(id, function (err) {
            client.close(function (error, result) {
              if (err) res.send(err);
              next();
            });
          });
        });
      });
  });
};

exports.deleteProductDoc = function (req, res, next) {
  var id = req.params.product_id;
  Product.findByIdAndDelete(id)
    .then((doc) => {
      res.status(200).send('Product successfully deleted');
    })
    .catch((err) => {
      res.status(500).send('Error deleting from database');
    });
};
