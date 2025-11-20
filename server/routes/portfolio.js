const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// GET portfolio - now uses username from request
router.get('/', async (req, res) => {
  try {
    const username = req.query.username || 'guest';
    let portfolio = await Portfolio.findOne({ userId: username });
    
    // If no portfolio exists, create one
    if (!portfolio) {
      portfolio = new Portfolio({ userId: username, balance: 10000 });
      await portfolio.save();
    }
    
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST buy stock
router.post('/buy', async (req, res) => {
  try {
    const { symbol, name, shares, price, username } = req.body;
    const userId = username || 'guest';
    const totalCost = shares * price;
    
    let portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      portfolio = new Portfolio({ userId, balance: 10000 });
    }
    
    if (portfolio.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    
    portfolio.balance -= totalCost;
    portfolio.stocks.push({ symbol, name, shares, purchasePrice: price });
    portfolio.transactions.push({ transactionType: 'buy', symbol, shares, price });
    
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST sell stock
router.post('/sell', async (req, res) => {
  try {
    const { symbol, shares, price, username } = req.body;
    const userId = username || 'guest';
    const totalValue = shares * price;
    
    let portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      return res.status(400).json({ message: 'Portfolio not found' });
    }
    
    // Find the stock
    const stockIndex = portfolio.stocks.findIndex(s => s.symbol === symbol);
    if (stockIndex === -1) {
      return res.status(400).json({ message: 'Stock not found in portfolio' });
    }
    
    if (portfolio.stocks[stockIndex].shares < shares) {
      return res.status(400).json({ message: 'Not enough shares' });
    }
    
    portfolio.balance += totalValue;
    portfolio.stocks[stockIndex].shares -= shares;
    
    // Remove stock if shares reach 0
    if (portfolio.stocks[stockIndex].shares === 0) {
      portfolio.stocks.splice(stockIndex, 1);
    }
    
    portfolio.transactions.push({ transactionType: 'sell', symbol, shares, price });
    
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;