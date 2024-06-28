const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

router.get('/register', (req, res, next) => {
  res.render('user_register');
});

router.post('/register', (req, res, next) => {
  let db = req.app.get('db');
  if (!db) {
    console.error("Database connection not found");
    return res.render('dbError', { message: "Database connection not found" });
  }

  let sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  let login = req.body.login;
  let password = req.body.password;
  const passwordHashed = bcrypt.hashSync(password, 10);
  db.run(sql, [login, passwordHashed], (err) => {
    if (err) {
      console.error(err.message);
      res.render('dbError');
    } else {
      res.render('user_created', { login: login, passwordHashed: passwordHashed });
    }
  });
});

router.get('/login', (req, res, next) => {
  res.render('user_login');
});

router.post('/login', (req, res, next) => {
  let db = req.app.get('db');
  if (!db) {
    console.error("Database connection not found");
    return res.render('dbError', { message: "Database connection not found" });
  }

  let sql = 'SELECT password FROM users WHERE username=?';
  let login = req.body.login;
  let password = req.body.password;
  db.get(sql, [login], (err, row) => {
    if (err) {
      console.error(err.message);
      res.render('dbError');
    } else {
      if (row === undefined) {
        res.render('user_loginfail');
      } else {
        const dbPasswordHashed = row.password;
        const wynik = bcrypt.compareSync(password, dbPasswordHashed);
        if (wynik) {
          const sessions = req.app.get('sessions');
          const sessionId = crypto.randomBytes(16).toString('hex');
          console.log(sessionId);
          sessions.set(sessionId, login);
          res.cookie('sessionId', sessionId, { maxAge: 600000 });
          res.render('user_logged', { login: login });
        } else {
          res.render('user_loginfail');
        }
      }
    }
  });
});

module.exports = router;
