// i'm importing express to create my api routes
// express makes it easy to handle http requests and responses
const express = require('express');

// i'm creating a router instance to define my authentication routes
// this keeps my auth-related routes organized and separate from other routes
const router = express.Router();

// i'm importing bcrypt to hash passwords securely
// bcrypt helps me encrypt passwords so they're not stored as plain text in the database
const bcrypt = require('bcrypt');

// i'm importing my user model to interact with the users collection
// this gives me access to all user-related database operations
const User = require('../models/User');

// here i'm creating the registration route for new users
// this route handles post requests to /register
router.post('/register', async (req, res) => {
  try {
    // i'm extracting username, email, and password from the request body
    // these are the credentials the user submitted through the registration form
    const { username, email, password } = req.body;
    
    // i'm checking if a user with this email or username already exists
    // the $or operator lets me search for either matching email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    // if i find an existing user, i stop the registration process
    // i send a 400 status code with an error message to inform the user
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // i'm hashing the password before storing it in the database
    // the number 10 is the salt rounds, which determines how secure the hash is
    // this protects user passwords even if someone accesses the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // i'm creating a new user instance with the provided information
    // i use the hashed password instead of the plain text password for security
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    // i'm saving the new user to the database
    // this actually stores the user document in mongodb
    await user.save();
    
    // i'm sending a success response with status 201 (created)
    // i include the username in the response so the frontend knows registration worked
    res.status(201).json({ message: 'User created successfully', username: user.username });
  } catch (err) {
    // if anything goes wrong, i catch the error and send it back to the user
    // this helps with debugging and informs the user what went wrong
    res.status(400).json({ message: err.message });
  }
});

// here i'm creating the login route for existing users
// this route handles post requests to /login
router.post('/login', async (req, res) => {
  try {
    // i'm extracting email and password from the login form
    // users need both to authenticate themselves
    const { email, password } = req.body;
    
    // i'm searching for a user with the provided email address
    // this checks if an account with this email exists in my database
    const user = await User.findOne({ email });
    
    // if no user is found, i send back an error message
    // i use "invalid credentials" instead of "user not found" for security
    // this prevents attackers from knowing which emails are registered
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // i'm comparing the provided password with the hashed password in the database
    // bcrypt.compare handles the decryption and comparison securely
    const validPassword = await bcrypt.compare(password, user.password);
    
    // if the passwords don't match, i reject the login attempt
    // again, i use the generic "invalid credentials" message for security
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // if everything checks out, i send a success response
    // i include the username so the frontend can display a personalized welcome
    res.json({ message: 'Login successful', username: user.username });
  } catch (err) {
    // if any error occurs during login, i catch it and send the error message
    // this helps me debug issues and informs the user something went wrong
    res.status(400).json({ message: err.message });
  }
});

// i'm exporting the router so i can use these routes in my main server file
// this makes my code modular and easier to maintain
module.exports = router;