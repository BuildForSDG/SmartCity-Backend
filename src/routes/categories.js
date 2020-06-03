const express = require('express');
const Category = require('../models/Categories');

const router = express.Router();

router.post('/', (req, res) => {
  const category = new Category(req.body);
  category.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json(doc);
  });
});
router.get('/', (req, res) => {
  Category.find((err, docs) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(docs);
  });
});
module.exports = router;
