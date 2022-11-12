var express = require('express');
const commonScripts = require("./common/common_script");
var router = express.Router();

commonScripts.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
