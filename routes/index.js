const { ensureAuthenticated, ensureGest } = require('../helpers/auth');
const express = require('express');
const Story = require('../models/Story.js');
const router = express.Router();

router.get('/', ensureGest, (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .then(stories => {
      res.render('index/dashboard', { stories });
    });

});

router.get('/about', (req, res) => {
  res.render('index/about');
});
module.exports = router;