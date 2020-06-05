const mongodb = require('mongodb');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const createError = require('http-errors');
const config = require('../config/keys');

const db = mongoose.connection;
const getBucket = (name) => new mongodb.GridFSBucket(db.db, {
  chunkSizeBytes: 1024,
  bucketName: name
});
function cb(res) {
  return (err, docs) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(docs);
  };
}

exports.getAll = (model) => (req, res) => {
  const { limit } = req.query;
  model.find().limit(parseFloat(limit)).sort('-datePosted').exec(cb(res));
};

exports.soughtByLocation = (model) => (req, res) => {
  const { limit } = req.query;
  const { location } = req.params;
  model.find()
    .limit(parseFloat(limit))
    .where('location')
    .equals(location)
    .sort('-datePosted')
    .exec(cb(res));
};
exports.soughtByCategory = (model) => (req, res) => {
  const { limit } = req.query;
  const { id } = req.params;
  model.find()
    .limit(parseFloat(limit))
    .where('categoryId')
    .equals(id)
    .sort('-datePosted')
    .exec(cb(res));
};
exports.soughtByCategoryAndLocation = (model) => (req, res) => {
  const { limit } = req.query;
  const { id, location } = req.params;
  model.find()
    .limit(parseFloat(limit))
    .where('location')
    .equals(location)
    .where('categoryId')
    .equals(id)
    .sort('-datePosted')
    .exec(cb(res));
};

/* ***************** */
/* Single Item */
/* ***************** */
exports.getSingle = (model) => (req, res) => {
  const { id } = req.params;
  model.findById(id).exec(cb(res));
};
exports.getAllReview = (model) => (req, res) => {
  const { id } = req.params;
  model.findById(id).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(doc.reviews);
  });
};
exports.postReview = (model) => (req, res) => {
  const { id } = req.params;
  // model.updateOne({ _id: id }, { $addToSet: { reviews: [review] } }, cb(res));
  model.findById(id, (error, document) => {
    if (error) res.status(400).send(error);
    document.reviews.addToSet({ ...req.body });
    document.save(cb(res));
  });
};
exports.getReview = (model) => (req, res) => {
  const { dId, rId } = req.params;
  model.findById(dId, (error, document) => {
    if (error) return res.status(400).send(error);
    const doc = document.reviews.id(rId);
    return res.status(200).json(doc);
  });
};
exports.removeReview = (model) => (req, res) => {
  const { dId, rId } = req.params;
  model.findById(dId, (error, document) => {
    if (error) res.status(400).send(error);
    document.reviews.id(rId).remove();
    document.save(cb(res));
  });
};

exports.save = (Model) => (req, res) => {
  const doc = new Model({
    _id: req.file.id,
    filename: req.file.filename,
    ...req.body
  });
  doc.save(cb(res));
};

exports.storage = (Model, bn, validate) => new GridFsStorage({
  url: config.mongoURI,
  options: { useUnifiedTopology: true },
  cache: 'sdg',
  file: (req, file) => {
    const doc = new Model(req.body);
    return new Promise((resolve, reject) => {
      const valid = validate(req);
      if (!valid) reject(createError(400, 'All fields are required'));

      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          reject(err);
        }
        const { _id } = doc;
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          _id,
          filename,
          metadata: doc,
          bucketName: bn
        };
        resolve(fileInfo);
      });
    });
  }
});

exports.getImage = (bn, col) => (req, res) => {
  const bucket = getBucket(bn);
  db.collection(col).find({ filename: req.params.filename }, (err, file) => {
    file.toArray((errors, docs) => {
      if (!docs.length) return res.status(400).send('No such file exists');
      return bucket
        .openDownloadStreamByName(req.params.filename)
        .pipe(res)
        .on('error', (er) => {
          res.status(400).send(er);
        })
        .on('finish', () => {
          res.end();
        });
    });
  });
};

exports.deleteFile = (bn) => (req, res, next) => {
  const bucket = getBucket(bn);
  const id = mongoose.Types.ObjectId(req.params.id);
  bucket.delete(id, (er) => {
    if (er) res.status(400).json({ ...er, message: 'No such file exists' });
    next();
  });
};

exports.deleteDoc = (model) => (req, res) => {
  const { id } = req.params;
  model.findByIdAndDelete(id)
    .then((doc) => {
      const { _doc } = doc;
      res.status(200).json({ ..._doc, deleted: true });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

/* ***************** */
/* Product Only */
/* ***************** */
exports.soughtByPrice = (model) => (req, res) => {
  const { limit } = req.query;
  const { from, to } = req.params;
  model.find()
    .where('price')
    .gt(parseFloat(from))
    .lt(parseFloat(to))
    .limit(parseFloat(limit))
    .sort('-datePosted')
    .exec(cb(res));
};
exports.getProductsFromSameSeller = (model) => (req, res) => {
  const { id } = req.params;
  model.find()
    .where('sellerId')
    .equals(id)
    .sort('-datePosted')
    .exec(cb(res));
};
