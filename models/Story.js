const mongoose = require('mongoose');

const Story = mongoose.model('Story', new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  allowComents: {
    type: Boolean,
    default: true
  },
  coments: [{
    comentBody: {
      type: String,
      required: true
    },
    comentDate: {
      type: Date,
      default: Date.now
    },
    comentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
}), 'stories');

module.exports = Story;