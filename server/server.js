
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/concepts', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/concepts.html'));
});

app.get('/guidance', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/guidance.html'));
});

app.get('/simulator', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/simulator.html'));
});

// API Routes
const conceptsRouter = require('./routes/concepts');
app.use('/api/concepts', conceptsRouter);

const questionsRouter = require('./routes/questions');
app.use('/api/questions', questionsRouter);

//adding
const portfolioRouter = require('./routes/portfolio');
app.use('/api/portfolio', portfolioRouter);

// API test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Money App API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see your app!`);
});