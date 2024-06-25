// Handle the /users route

// dependencies
var express = require('express');
var router = express.Router();

// Defines the /users route to send a simple response.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
