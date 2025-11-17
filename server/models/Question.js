const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Question', questionSchema);