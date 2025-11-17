const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default-user'
  },
  balance: {
    type: Number,
    default: 10000
  },
  stocks: [{
    symbol: String,
    name: String,
    shares: Number,
    purchasePrice: Number,
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }],
  transactions: [{
    transactionType: String, // Changed from 'type' to 'transactionType'
    symbol: String,
    shares: Number,
    price: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Portfolio', portfolioSchema);