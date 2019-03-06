const Story = require('../models/Story');
const { ensureAuthenticated } = require('../helpers/auth');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .sort({ date: 'desc' })
    .then(stories => {
      res.render('stories/index', { stories });
    });
});

router.get('/show/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate('user coments.comentUser')
    .then(story => {
      if (story.status == 'public') {
        res.render('stories/show', { story });
      }
      else {
        if (story.user._id == req.user.id) {
          res.render('stories/show', { story });
        }
        else {
          res.redirect('/stories');
        }
      }
    });
});

// List Stories of a user
router.get('/user/:id', (req, res) => {
  Story.find({ user: req.params.id, status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', { stories });
    });
});

// logged user stories
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate('user')
    .then((stories => {
      res.render('stories/index', { stories });
    }));
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

router.post('/', ensureAuthenticated, (req, res) => {
  const allowComents = req.body.allowComents ? true : false;
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComents: allowComents,
    user: req.user.id
  }

  new Story(newStory).save()
    .then((story) => {
      res.redirect(`/stories/show/${story.id}`)
    })

});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .then(story => {
      if (story.user != req.user.id) res.redirect('/stories');
      else res.render('stories/edit', { story });
    });
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .then(story => {
      const allowComents = req.body.allowComents ? true : false;

      story.title = req.body.title;
      story.body = req.body.body;
      story.status = req.body.status;
      story.allowComents = allowComents;

      story.save().then(() => {
        res.redirect('/dashboard');
      });
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Story.findOneAndDelete({ _id: req.params.id })
    .then(() => {
      res.redirect('/dashboard');
    });
});

// add comment
router.post('/comment/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .then(story => {
      story.coments.unshift({ comentBody: req.body.comentBody, comentUser: req.user.id });
      story.save().then(story => {
        res.redirect(`/stories/show/${story.id}`);
      });
    });
});

module.exports = router;