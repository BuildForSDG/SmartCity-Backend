const express = require('express');
const {
  getAllArtisans,
  saveArtisan,
  soughtByLocation,
  soughtByField,
  soughtByFieldAndLocation,
  getSingleArtisan,
  getArtisanReview,
  postReview,
  upload,
  getArtisanImage,
  deleteArtisanFile,
  deleteArtisanDoc
} = require('../middlewares/artisans');

const router = express.Router();

router.get('/', getAllArtisans);
router.get('/inLocation/:location', soughtByLocation);
router.get('/inField/:fieldId', soughtByField);
router.get('/inField/:fieldId/inLocation/:location', soughtByFieldAndLocation);
router.get('/:artisanId', getSingleArtisan);
router.get('/:artisanId/reviews', getArtisanReview);
router.post('/', upload.single('thumbnail'), saveArtisan);
router.post('/:artisanId/reviews', postReview);
router.get('/images/:filename', getArtisanImage);
router.delete('/:artisanId', deleteArtisanFile, deleteArtisanDoc);

module.exports = router;
