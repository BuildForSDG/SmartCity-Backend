const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
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
  removeReview,
  soughtByPrice,
  getProductsFromSameSeller
} = require('../middlewares/store');

const router = express.Router();
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
const upload = multer({ storage: storage(Product, 'productUploads', validate) });

router.get('/', getAll(Product));
router.get('/inLocation/:location', soughtByLocation(Product));
router.get('/inCategory/:id', soughtByCategory(Product));
router.get('/inCategory/:id/inLocation/:location', soughtByCategoryAndLocation(Product));
router.get('/:id', getSingle(Product));
router.get('/:id/reviews', getAllReview(Product));
router.post('/', upload.single('thumbnail'), save(Product));
router.post('/:id/reviews', postReview(Product));
router.get('/images/:filename', getImage('productUploads', 'productUploads.files'));
router.delete('/:id', deleteFile('productUploads'), deleteDoc(Product));
router.delete('/:dId/reviews/:rId', removeReview(Product));
router.get('/:dId/reviews/:rId', getReview(Product));
router.get('/inRange/:from-:to', soughtByPrice(Product));
router.get('/fromSeller/:id', getProductsFromSameSeller(Product));

module.exports = router;
