const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  console.log('some shiity test, some more');
  res.render('index', { title: 'SmartCity' });
});

module.exports = router;
