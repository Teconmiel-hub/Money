// i'm importing express to create my api routes
// express helps me handle http requests and build my rest api
const express = require('express');

// i'm creating a router instance to organize my concept-related routes
// this keeps all concept operations in one place and makes my code cleaner
const router = express.Router();

// i'm importing my concept model to interact with the concepts collection
// this allows me to perform database operations like finding and saving concepts
const Concept = require('../models/Concept');

// here i'm creating a route to get all concepts from the database
// this handles get requests to the base route '/'
router.get('/', async (req, res) => {
  try {
    // i'm using concept.find() to retrieve all concepts from mongodb
    // find() with no parameters returns every document in the collection
    const concepts = await Concept.find();
    
    // i'm sending the array of concepts back as json
    // the frontend can use this data to display all concepts to the user
    res.json(concepts);
  } catch (err) {
    // if something goes wrong during the database query, i catch the error
    // i send a 500 status code because this is a server error, not a client error
    res.status(500).json({ message: err.message });
  }
});

// here i'm creating a route to add a new concept to the database
// this handles post requests to the base route '/'
router.post('/', async (req, res) => {
  // i'm creating a new concept instance using data from the request body
  // the request body contains the title, description, and category sent by the user
  const concept = new Concept({
    // i'm extracting the title from the request body
    title: req.body.title,
    
    // i'm extracting the description from the request body
    description: req.body.description,
    
    // i'm extracting the category from the request body
    category: req.body.category
  });

  try {
    // i'm saving the new concept to the database
    // save() returns the saved document with its generated _id and createdAt fields
    const newConcept = await concept.save();
    
    // i'm sending back the newly created concept with status 201 (created)
    // this confirms to the frontend that the concept was successfully added
    res.status(201).json(newConcept);
  } catch (err) {
    // if the save fails (maybe missing required fields), i catch the error
    // i send a 400 status code because this is a client error (bad request data)
    res.status(400).json({ message: err.message });
  }
});

// i'm exporting the router so i can use these concept routes in my main server file
// this makes my application modular and easier to organize
module.exports = router;