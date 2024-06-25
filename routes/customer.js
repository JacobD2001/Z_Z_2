var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var path = require('path');

let dbPath = path.join(__dirname, '..', 'chinook.db');

let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the chinook database.');
  }
});

router.get('/:id', function(req, res, next) {
  let sql = `SELECT * FROM Customer WHERE CustomerId = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.render('error', { message: 'Database error', error: err });
    } else {
      res.render('customer', { title: 'Customer Details', customer: row });
    }
  });
});

module.exports = router;
