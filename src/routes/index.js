var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('some shiity test, some more')
 res.render('index', { title: 'SmartCity' });

});

module.exports = router;
