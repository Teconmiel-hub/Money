const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// API test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Money App API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see your app!`);
});

