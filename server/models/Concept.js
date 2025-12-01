// i'm importing mongoose here because i need it to connect my app to mongodb
// mongoose makes it way easier to work with mongodb than using the native driver
const mongoose = require('mongoose');

// here i'm creating the schema for my concept model
// this basically tells mongodb what fields my concepts should have
// and what type of data goes in each field
const conceptSchema = new mongoose.Schema({
  
  // the title field stores the name of each concept
  title: {
    // i'm using string type because titles are always text
    type: String,
    
    // i set this to required because i don't want concepts without titles
    // it would be confusing to have unnamed concepts in my database
    required: true
  },
  
  // the description field holds detailed information about the concept
  description: {
    // also a string since descriptions are text-based
    type: String,
    
    // i made this required too because a concept needs an explanation
    // otherwise users won't understand what the concept is about
    required: true
  },
  
  // i added the category field so i can organize my concepts into groups
  category: {
    // string type for the category name (like "math", "science", etc.)
    type: String,
    
    // i require this field because i want every concept to be categorized
    // this will help me filter and sort concepts later in my app
    required: true
  },
  
  // the createdat field tracks when each concept was added to the database
  createdAt: {
    // i'm using the date type to store timestamps
    type: Date,
    
    // i set date.now as the default so it automatically records the creation time
    // this way i don't have to manually add the date every time i create a concept
    // it just happens automatically when i save a new document
    default: Date.now
  }
});

// i'm exporting this as a mongoose model so i can use it in other files
// the first parameter 'concept' is the model name
// mongoose will automatically look for a collection called 'concepts' in my database
// now i can import this model anywhere in my project to create, read, update, or delete concepts
module.exports = mongoose.model('Concept', conceptSchema);