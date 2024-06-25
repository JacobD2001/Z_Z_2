var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var sqlite3 = require('sqlite3').verbose();

//var indexRouter = require('./routes/index');
var dataRouter = require('./routes/data');
var formdataRouter = require('./routes/formdata'); // Import the new formdata route
var customerRouter = require('./routes/customer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//let db = new sqlite3.Database('./db/chinook.db', (err) => {
//  if (err) {
//    console.error(err.message);
//  }
//  console.log('Connected to the chinook database.');
//});

// /index/whatever/5 -> /whatever/5
//app.use('/index', indexRouter);
app.get('/data', dataRouter);

// Use the formdata router for handling form submissions
app.use('/formdata', formdataRouter);
app.use('/customer', customerRouter);

app.get('/', (req, res) => res.render('index', { title: "Zadanie 2" }));
app.get('/form', (req, res) => res.render('form', { title: "Form" }));


 //formdata should be handled by submitting the form naullay no need
//app.get('/formdata', (req, res) => res.render('formdata', { title: "FormData" }));
//app.get('/data', (req, res) => res.render('data', { title: "Data" }));

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

//db.close((err) => {
//  if (err) {
//    console.error(err.message);
//  }
//  console.log('Close the database connection.');
//});
module.exports = app;
