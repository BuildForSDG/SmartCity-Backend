const mongoose = require('mongoose');
const mongodb = require('mongodb');
const createError = require('http-errors');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const config = require('../config/keys');
const Product = require('../models/Product');

exports.getAllProducts = (req, res) => {
  const { limit } = req.query;
  const product = new Product();
  product.findAll(limit, (err, docs) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(docs);
  });
};

exports.soughtByPrice = (req, res) => {
  const { limit } = req.query;
  const { from, to } = req.params;
  Product.find()
    .where('price')
    .gt(parseFloat(from))
    .lt(parseFloat(to))
    .limit(parseFloat(limit))
    .sort('-datePosted')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(docs);
    });
};
exports.soughtByLocation = (req, res) => {
  const { limit } = req.query;
  const { location } = req.params;
  Product.find()
    .limit(parseFloat(limit))
    .where('location')
    .equals(location)
    .sort('-datePosted')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(docs);
    });
};
exports.soughtByCategory = (req, res) => {
  const { limit } = req.query;
  const { categoryId } = req.params;
  Product.find()
    .limit(parseFloat(limit))
    .where('category_id')
    .equals(categoryId)
    .sort('-datePosted')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(docs);
    });
};
exports.soughtByCategoryAndLocation = (req, res) => {
  const { limit } = req.query;
  const { categoryId, location } = req.params;
  Product.find()
    .limit(parseFloat(limit))
    .where('location')
    .equals(location)
    .where('category_id')
    .equals(categoryId)
    .sort('-datePosted')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(docs);
    });
};

/* ***************** */
/* Single Products */
/* ***************** */
exports.getSingleProducts = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(doc);
  });
};
exports.getProductReview = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(doc.reviews);
  });
};
exports.postReview = (req, res) => {
  const { productId } = req.params;
  const review = req.body;
  Product.findById(productId, (err, doc) => {
    if (err) res.status(400).send(err);
    doc.reviews.push(review);
    doc.save((error, document) => {
      if (error) return res.status(400).send(error);
      return res.status(200).json(document);
    });
  });
};

exports.saveProduct = (req, res) => {
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

const validate = (req) => {
  const {
    name, description, price, discountedPrice, categoryId, sellerId, location
  } = req.body;

  const res = !!name
   && !!description
   && !!price
   && !!discountedPrice
   && !!categoryId
   && !!sellerId
   && !!location;
  return res;
};
const storage = new GridFsStorage({
  url: config.mongoURI,
  options: { useUnifiedTopology: true },
  cache: 'sdg',
  file: (req, file) => {
    const product = new Product(req.body);
    return new Promise((resolve, reject) => {
      const valid = validate(req);
      if (!valid) reject(createError(400, 'All fields are required'));

      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          reject(err);
        }
        const { _id } = product;
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          _id,
          filename,
          metadata: product,
          bucketName: 'productUploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
exports.upload = multer({ storage });

exports.getProductImage = (req, res) => {
  mongodb.MongoClient.connect(config.mongoURI, (error, client) => {
    if (error) res.status(400).send(error);
    console.log(client.db);
    const bucket = new mongodb.GridFSBucket(client.db(), {
      chunkSizeBytes: 1024,
      bucketName: 'productUploads'
    });
    client
      .db()
      .collection('productUploads.files')
      .find({ filename: req.params.filename }, (errors, file) => {
        file.toArray((err, docs) => {
          if (!docs.length) res.status(400).send('No such file exists');
          if (err) res.status(400).json(err);
          bucket
            .openDownloadStreamByName(req.params.filename)
            .pipe(res)
            .on('error', (er) => {
              res.status(400).send(er);
            })
            .on('finish', () => {
              client.close(() => {
                console.log('done!');
                res.end();
              });
            });
        });
      });
  });
};

exports.deleteProductFile = (req, res, next) => {
  mongodb.MongoClient.connect(config.mongoURI, (error, client) => {
    if (error) res.status(400).send(error);
    const bucket = new mongodb.GridFSBucket(client.db(), {
      chunkSizeBytes: 1024,
      bucketName: 'productUploads'
    });
    const validId = mongoose.Types.ObjectId.isValid(req.params.product_id);
    if (!validId) res.status(400).send('Invalid ObjectId');
    const id = mongoose.Types.ObjectId(req.params.product_id);
    client
      .db()
      .collection('productUploads.files')
      .find({ _id: id }, (errors, file) => {
        file.toArray((err, docs) => {
          if (!docs.length) res.status(400).send('No such file exists');
          bucket.delete(id, (er) => {
            client.close(() => {
              if (er) res.send(er);
              next();
            });
          });
        });
      });
  });
};

exports.deleteProductDoc = (req, res) => {
  const id = req.params.productId;
  Product.findByIdAndDelete(id)
    .then((doc) => {
      res.status(200).json({ ...doc, deleted: true });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
