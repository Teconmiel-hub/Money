// i'm importing express to create my question api routes
// express helps me handle http requests for my question management system
const express = require('express');

// i'm creating a router instance to organize all question-related routes
// this keeps my question operations separate and organized
const router = express.Router();

// i'm importing my question model to interact with the questions collection
// this allows me to perform database operations like retrieving and saving questions
const Question = require('../models/Question');

// here i'm creating a route to get all questions from the database
// this handles get requests to retrieve the complete list of questions
router.get('/', async (req, res) => {
  try {
    // i'm using question.find() to get all questions from mongodb
    // i'm also using sort('order') to arrange them in the correct sequence
    // this ensures questions appear in the right order for users to answer them
    const questions = await Question.find().sort('order');
    
    // i'm sending the sorted array of questions back as json
    // the frontend can use this data to display questions in the proper order
    res.json(questions);
  } catch (err) {
    // if something goes wrong during the database query, i catch the error
    // i send a 500 status code because this is a server-side error
    res.status(500).json({ message: err.message });
  }
});

// here i'm creating a route to add a new question to the database
// this handles post requests when creating new questions
router.post('/', async (req, res) => {
  // i'm creating a new question instance using data from the request body
  // the request body contains the question text, order number, and category
  const question = new Question({
    // i'm extracting the question text from the request body
    // this is the actual question that will be displayed to users
    questionText: req.body.questionText,
    
    // i'm extracting the order number from the request body
    // this determines where this question appears in the sequence
    order: req.body.order,
    
    // i'm extracting the category from the request body
    // this helps organize questions by topic or subject
    category: req.body.category
  });

  try {
    // i'm saving the new question to the database
    // save() returns the saved document with its generated _id field
    const newQuestion = await question.save();
    
    // i'm sending back the newly created question with status 201 (created)
    // this confirms to the frontend that the question was successfully added
    res.status(201).json(newQuestion);
  } catch (err) {
    // if the save fails (maybe missing required fields), i catch the error
    // i send a 400 status code because this is a client error (bad request data)
    res.status(400).json({ message: err.message });
  }
});

// i'm exporting the router so i can use these question routes in my main server file
// this makes my application modular and easier to maintain
module.exports = router;