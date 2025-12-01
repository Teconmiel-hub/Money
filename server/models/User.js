// i'm importing mongoose to work with mongodb in my application
// this library helps me define user data structure and validation rules
const mongoose = require('mongoose');

// here i'm creating the schema for my user model
// this defines all the information i need to store for each user account
const userSchema = new mongoose.Schema({
  
  // the username field stores the display name that users choose
  username: {
    // i'm using string type because usernames are text
    type: String,
    
    // i made this required because every user needs a username to identify themselves
    required: true,
    
    // i set this to unique so no two users can have the same username
    // this prevents confusion and ensures each user has a distinct identity
    unique: true
  },
  
  // the email field stores the user's email address
  email: {
    // i'm using string type for email addresses
    type: String,
    
    // i made this required because i need emails for account verification and communication
    required: true,
    
    // i set this to unique so each email can only be used once
    // this prevents duplicate accounts and helps with password recovery
    unique: true
  },
  
  // the password field stores the user's encrypted password
  password: {
    // i'm using string type to store the hashed password
    type: String,
    
    // i made this required because users need passwords to secure their accounts
    // without a password, anyone could access the account
    required: true
  },
  
  // the createdat field tracks when the user registered
  createdAt: {
    // i'm using date type to store the registration timestamp
    type: Date,
    
    // i set date.now as default so it automatically records when the account was created
    // this helps me track user growth and account age without manual entry
    default: Date.now
  }
});

// i'm exporting this as a mongoose model named 'user'
// mongoose will look for a collection called 'users' in my database
// now i can use this model throughout my app for user authentication and management
module.exports = mongoose.model('User', userSchema);