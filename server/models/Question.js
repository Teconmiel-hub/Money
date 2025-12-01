// i'm importing mongoose so i can define my data structure for mongodb
// this helps me create a consistent format for all questions in my database
const mongoose = require('mongoose');

// here i'm creating the schema for my question model
// this defines what information each question will have in my app
const questionSchema = new mongoose.Schema({
  
  // the questiontext field stores the actual question content
  questionText: {
    // i'm using string type because questions are text-based
    type: String,
    
    // i made this required because every question needs actual text
    // it wouldn't make sense to have empty questions in my database
    required: true
  },
  
  // the order field determines the sequence in which questions appear
  order: {
    // i'm using number type since order is a numeric value
    type: Number,
    
    // i set this as required because i need to control the question sequence
    // this helps me display questions in the right order to users
    required: true
  },
  
  // the category field groups questions by topic or subject area
  category: {
    // i'm using string type for category names
    type: String,
    
    // i made this required so every question belongs to a specific category
    // this makes it easier to organize and filter questions later
    required: true
  }
});

// i'm exporting this as a mongoose model called 'question'
// mongoose will automatically create or use a collection named 'questions' in my database
// now i can import this model in other files to