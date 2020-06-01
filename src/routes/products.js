var express = require('express')
const {
    getAllProducts,
    saveProduct,
    soughtByPrice,
    soughtByLocation,
    soughtByCategory,
    soughtByCategoryAndLocation,
    getSingleProducts,
    getProductReview,
    postReview,
    upload,
    getProductImage,
    deleteProductFile,
    deleteProductDoc
} = require('../middlewares/products')
var router = express.Router();


router.get('/',getAllProducts)
router.get('/inRange/:from-:to', soughtByPrice)
router.get('/inLocation/:location',soughtByLocation)
router.get('/inCategory/:category_id',soughtByCategory)
router.get('/inCategory/:category_id/inLocation/:location', soughtByCategoryAndLocation)
router.get('/:product_id',getSingleProducts)
router.get('/:product_id/reviews', getProductReview)
router.post('/', upload.single('thumbnail'), saveProduct)
router.post('/:product_id/reviews',postReview)
router.get('/images/:filename', getProductImage)
router.delete('/:product_id', deleteProductFile, deleteProductDoc)

module.exports = router
