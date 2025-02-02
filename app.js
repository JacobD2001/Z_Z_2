var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const usersRouter = require('./routes/users');



var app = express();
const sessions = new Map();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const db = new sqlite3.Database('./chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Połączenie z bazą otwarte');
});

app.set('db', db);
app.set('sessions', sessions);

//routers
app.use('/users', usersRouter);

// index
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});


// customers
app.get('/customers', (req, res) => {
  const sql = "SELECT CustomerId, FirstName, LastName, Company FROM Customer";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.render('dbError');
    } else {
      res.render('customer_list', { customers: rows });
    }
  });
});

app.get('/customer/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = "SELECT * FROM Customer WHERE CustomerId = ?";
  db.get(sql, [customerId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.render('dbError');
    } else if (!row) {
      res.render('dbError', { message: "Customer not found" });
    } else {
      res.render('customer_details', { customer: row });
    }
  });
});

app.get('/customers/add', (req, res) => {
  res.render('customer_add');
});

app.post('/customers/add', (req, res) => {
  const { FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId } = req.body;
  const sql = "INSERT INTO Customer (FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId], function(err) {
    if (err) {
      console.error(err.message);
      res.render('dbError');
    } else {
      console.log(`A new customer has been added with id ${this.lastID}`);
      res.redirect('/customers');
    }
  });
});

app.get('/customer/edit/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = "SELECT * FROM Customer WHERE CustomerId = ?";
  db.get(sql, [customerId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.render('dbError');
    } else {
      res.render('customer_edit', { customer: row });
    }
  });
});

app.post('/customer/edit/:id', (req, res) => {
  const { FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId } = req.body;
  const customerId = req.params.id;
  const sql = "UPDATE Customer SET FirstName = ?, LastName = ?, Company = ?, Address = ?, City = ?, State = ?, Country = ?, PostalCode = ?, Phone = ?, Fax = ?, Email = ?, SupportRepId = ? WHERE CustomerId = ?";
  db.run(sql, [FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId, customerId], function(err) {
    if (err) {
      console.error(err.message);
      res.render('dbError');
    } else {
      console.log(`Customer with id ${customerId} has been updated`);
      res.redirect(`/customer/${customerId}`);
    }
  });
});

app.post('/customer/delete/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = "DELETE FROM Customer WHERE CustomerId = ?";
  db.run(sql, [customerId], function(err) {
    if (err) {
      console.error(err.message);
      res.render('dbError');
    } else {
      console.log(`Customer with id ${customerId} has been deleted`);
      res.redirect('/customers');
    }
  });
});

// errors middleware

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
