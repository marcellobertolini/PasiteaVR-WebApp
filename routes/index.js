var express = require('express');
var router = express.Router();
var ip = require('ip');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { ipAddress: ip.address() });
});

module.exports = router;
