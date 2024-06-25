var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var path = require('path');

// Construct the absolute path to the database
let dbPath = path.join(__dirname, '..', 'chinook.db');

let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the chinook database.');
  }
});

// Define the SQL query
let sql = `SELECT CustomerId, FirstName, LastName, Company, City FROM Customer ORDER BY CustomerId`;

// Define the GET route for /data
router.get('/data', function(req, res, next) {
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.render('error', { message: 'Database error', error: err });
    } else {
      res.render('data', { title: 'Customer Data', data: rows });
    }
  });
});

module.exports = router;
