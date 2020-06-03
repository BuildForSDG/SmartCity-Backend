const mongodb = require('mongodb');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const createError = require('http-errors');
const Artisan = require('../models/Artisan');
const config = require('../config/keys');

exports.getAllArtisans = (req, res) => {
  const { limit } = req.query;
  const artisan = new Artisan();
  artisan.findAll(limit, (err, docs) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(docs);
  });
};

exports.soughtByLocation = (req, res) => {
  const { limit } = req.query;
  const { location } = req.params;
  Artisan.find()
    .limit(parseFloat(limit))
    .where('location')
    .equals(location)
    .sort('-datePosted')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(docs);
    });
};
exports.soughtByField = (req, res) => {
  const { limit } = req.query;
  const { fieldId } = req.params;
  Artisan.find()
    .limit(parseFloat(limit))
    .where('field_id')
    .equals(fieldId)
    .sort('-datePosted')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(docs);
    });
};
exports.soughtByFieldAndLocation = (req, res) => {
  const { limit } = req.query;
  const { fieldId, location } = req.params;
  Artisan.find()
    .limit(parseFloat(limit))
    .where('location')
    .equals(location)
    .where('field_id')
    .equals(fieldId)
    .sort('-datePosted')
    .exec((err, docs) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(docs);
    });
};

/* ***************** */
/* Single Artisan */
/* ***************** */
exports.getSingleArtisan = (req, res) => {
  const { artisanId } = req.params;
  Artisan.findById(artisanId).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(doc);
  });
};
exports.getArtisanReview = (req, res) => {
  const { artisanId } = req.params;
  Artisan.findById(artisanId).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(doc.reviews);
  });
};
exports.postReview = (req, res) => {
  const { artisanId } = req.params;
  const review = req.body;
  Artisan.findById(artisanId, (err, doc) => {
    if (err) res.status(400).send(err);
    doc.reviews.push(review);
    doc.save((error, document) => {
      if (error) return res.status(400).send(error);
      return res.status(200).json(document);
    });
  });
};

exports.saveArtisan = (req, res) => {
  console.log(req.file);
  const artisan = new Artisan({
    _id: req.file.id,
    filename: req.file.filename,
    ...req.body
  });
  artisan.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, ...err });
    return res.status(200).send(doc);
  });
};

const validate = (req) => {
  const {
    name, description, fieldId, location
  } = req.body;

  return !!name && !!description && !!fieldId && !!location;
};
const storage = new GridFsStorage({
  url: config.mongoURI,
  options: { useUnifiedTopology: true },
  cache: 'sdg',
  file: (req, file) => {
    const artisan = new Artisan(req.body);
    return new Promise((resolve, reject) => {
      const valid = validate(req);
      if (!valid) reject(createError(400, 'All fields are required'));

      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          reject(err);
        }
        const { _id } = artisan;
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          _id,
          filename,
          metadata: artisan,
          bucketName: 'artisanUploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
exports.upload = multer({ storage });

exports.getArtisanImage = (req, res) => {
  mongodb.MongoClient.connect(config.mongoURI, (error, client) => {
    if (error) res.status(400).send(error);
    console.log(client.db);
    const bucket = new mongodb.GridFSBucket(client.db(), {
      chunkSizeBytes: 1024,
      bucketName: 'artisanUploads'
    });
    client
      .db()
      .collection('artisanUploads.files')
      .find({ filename: req.params.filename }, (err, file) => {
        file.toArray((errors, docs) => {
          if (!docs.length) res.status(400).send('No such file exists');
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

exports.deleteArtisanFile = (req, res, next) => {
  mongodb.MongoClient.connect(config.mongoURI, (error, client) => {
    if (error) res.status(400).send(error);
    const bucket = new mongodb.GridFSBucket(client.db(), {
      chunkSizeBytes: 1024,
      bucketName: 'artisanUploads'
    });
    const validId = mongoose.Types.ObjectId.isValid(req.params.artisan_id);
    if (!validId) res.status(400).send('Invalid ObjectId');
    const id = mongoose.Types.ObjectId(req.params.artisan_id);
    client
      .db()
      .collection('artisanUploads.files')
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

exports.deleteArtisanDoc = (req, res) => {
  const id = req.params.artisanId;
  Artisan.findByIdAndDelete(id)
    .then((doc) => {
      res.status(200).json({ ...doc, deleted: true });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};