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

router.post('/', function(req, res, next) {
  const { FName, LName, Email, Company, City } = req.body;
  let sql = `INSERT INTO Customer (FirstName, LastName, Email, Company, City) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [FName, LName, Email, Company, City], function(err) {
    if (err) {
      console.error('Error inserting data:', err.message);
      return res.render('error', { message: 'Database error', error: err });
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.render('formdata', { title: 'Form Data', FName, LName, Email, Company, City });
  });
});

module.exports = router;
