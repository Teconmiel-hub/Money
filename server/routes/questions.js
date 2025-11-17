const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort('order');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new question
router.post('/', async (req, res) => {
  const question = new Question({
    questionText: req.body.questionText,
    order: req.body.order,
    category: req.body.category
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;