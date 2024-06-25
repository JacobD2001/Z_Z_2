// HANDLES / route - MAIN ONE

var express = require('express');
var router = express.Router();

// Defines the root route (/) to render the index view.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// exports router
module.exports = router;
