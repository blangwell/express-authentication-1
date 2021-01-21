const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created]) => {
    if (created) {
      console.log(`${user.name} was created`);
      res.redirect('/');
    } else {
      console.log('email already exists');
      res.redirect('/auth/signup');
    }
  })
  .catch(err => {
    console.log('OOPS : ', err.message);
    res.redirect('/auth/signup');
  })
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

module.exports = router;
