// DISPLAY THE FORM  /form - route

// dependencies
var express = require('express');
var router = express.Router();
//var bodyParser = require('body-parser');

// Defines the /form route to render the form view.
router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Form Express' });
});

// exports router
module.exports = router;
