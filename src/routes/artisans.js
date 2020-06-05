const express = require('express');
const multer = require('multer');
const Artisan = require('../models/Artisan');
const {
  getAll,
  save,
  soughtByLocation,
  soughtByCategory,
  soughtByCategoryAndLocation,
  getSingle,
  getAllReview,
  postReview,
  storage,
  getImage,
  deleteFile,
  deleteDoc,
  getReview,
  removeReview
} = require('../middlewares/store');

const router = express.Router();
const validate = (req) => {
  const {
    name, description, categoryId, location
  } = req.body;

  return !!name && !!description && !!categoryId && !!location;
};
const upload = multer({ storage: storage(Artisan, 'artisanUploads', validate) });

router.get('/', getAll(Artisan));
router.get('/inLocation/:location', soughtByLocation(Artisan));
router.get('/inCategory/:id', soughtByCategory(Artisan));
router.get('/inCategory/:id/inLocation/:location', soughtByCategoryAndLocation(Artisan));
router.get('/:id', getSingle(Artisan));
router.get('/:id/reviews', getAllReview(Artisan));
router.post('/', upload.single('thumbnail'), save(Artisan));
router.post('/:id/reviews', postReview(Artisan));
router.get('/images/:filename', getImage('artisanUploads', 'artisanUploads.files'));
router.delete('/:id', deleteFile('artisanUploads'), deleteDoc(Artisan));
router.delete('/:dId/reviews/:rId', removeReview(Artisan));
router.get('/:dId/reviews/:rId', getReview(Artisan));

module.exports = router;
