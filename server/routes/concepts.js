const express = require('express');
const router = express.Router();
const Concept = require('../models/Concept');

// GET all concepts
router.get('/', async (req, res) => {
  try {
    const concepts = await Concept.find();
    res.json(concepts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new concept
router.post('/', async (req, res) => {
  const concept = new Concept({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category
  });

  try {
    const newConcept = await concept.save();
    res.status(201).json(newConcept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;