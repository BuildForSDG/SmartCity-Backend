var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/single', function(req, res, next) {
  console.log(req.baseUrl)
  res.send('single dude here');
});

module.exports = router;
