// i'm importing express to build my portfolio api routes
// express helps me handle different types of http requests for portfolio operations
const express = require('express');

// i'm creating a router instance to keep my portfolio routes organized
// this separates portfolio logic from other parts of my application
const router = express.Router();

// i'm importing my portfolio model to interact with the portfolios collection
// this gives me access to all portfolio-related database operations
const Portfolio = require('../models/Portfolio');

// here i'm creating a route to get a user's portfolio
// this handles get requests and uses the username from query parameters
router.get('/', async (req, res) => {
  try {
    // i'm extracting the username from the query string (like ?username=john)
    // if no username is provided, i default to 'guest' for anonymous users
    const username = req.query.username || 'guest';
    
    // i'm searching for a portfolio that belongs to this specific user
    // findone returns the first matching portfolio or null if none exists
    let portfolio = await Portfolio.findOne({ userId: username });
    
    // if no portfolio exists for this user, i create a new one
    // this ensures every user has a portfolio automatically
    if (!portfolio) {
      // i'm creating a new portfolio with the username and starting balance of $10,000
      portfolio = new Portfolio({ userId: username, balance: 10000 });
      
      // i'm saving the new portfolio to the database
      await portfolio.save();
    }
    
    // i'm sending the portfolio data back as json
    // the frontend uses this to display the user's stocks and balance
    res.json(portfolio);
  } catch (err) {
    // if anything goes wrong, i catch the error and send it back
    // status 500 indicates a server error during the database operation
    res.status(500).json({ message: err.message });
  }
});

// here i'm creating a route to buy stocks
// this handles post requests when users want to purchase shares
router.post('/buy', async (req, res) => {
  try {
    // i'm extracting all the necessary information from the request body
    // symbol is the stock ticker, name is the company name, shares is quantity, price is per share
    const { symbol, name, shares, price, username } = req.body;
    
    // i'm setting the userid, defaulting to 'guest' if no username is provided
    const userId = username || 'guest';
    
    // i'm calculating the total cost of this purchase
    // this is how much money will be deducted from the user's balance
    const totalCost = shares * price;
    
    // i'm looking for the user's existing portfolio
    let portfolio = await Portfolio.findOne({ userId });
    
    // if the user doesn't have a portfolio yet, i create one with the default balance
    // this handles cases where someone buys stock before viewing their portfolio
    if (!portfolio) {
      portfolio = new Portfolio({ userId, balance: 10000 });
    }
    
    // i'm checking if the user has enough money to make this purchase
    // if their balance is less than the total cost, i reject the transaction
    if (portfolio.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    
    // i'm deducting the total cost from the user's available balance
    portfolio.balance -= totalCost;
    
    // i'm adding the newly purchased stock to the user's stocks array
    // this records what they bought, how many shares, and at what price
    portfolio.stocks.push({ symbol, name, shares, purchasePrice: price });
    
    // i'm adding this transaction to the transaction history
    // this creates a permanent record of the purchase for tracking purposes
    portfolio.transactions.push({ transactionType: 'buy', symbol, shares, price });
    
    // i'm saving all the changes to the database
    await portfolio.save();
    
    // i'm sending back the updated portfolio so the frontend can refresh the display
    res.json(portfolio);
  } catch (err) {
    // if anything fails during the buy process, i catch the error
    // status 400 indicates a client error, like invalid data
    res.status(400).json({ message: err.message });
  }
});

// here i'm creating a route to sell stocks
// this handles post requests when users want to sell their shares
router.post('/sell', async (req, res) => {
  try {
    // i'm extracting the necessary information for selling stocks
    // i need the symbol, how many shares to sell, current price, and username
    const { symbol, shares, price, username } = req.body;
    
    // i'm setting the userid, defaulting to 'guest' if not provided
    const userId = username || 'guest';
    
    // i'm calculating the total value the user will receive from this sale
    // this is how much money will be added back to their balance
    const totalValue = shares * price;
    
    // i'm finding the user's portfolio in the database
    let portfolio = await Portfolio.findOne({ userId });
    
    // if no portfolio exists, i can't proceed with the sale
    // i return an error because you can't sell stocks you don't own
    if (!portfolio) {
      return res.status(400).json({ message: 'Portfolio not found' });
    }
    
    // i'm searching for the specific stock in the user's portfolio
    // findindex returns the position of the stock in the array, or -1 if not found
    const stockIndex = portfolio.stocks.findIndex(s => s.symbol === symbol);
    
    // if the stock isn't in the portfolio, i can't sell it
    // i return an error message to inform the user
    if (stockIndex === -1) {
      return res.status(400).json({ message: 'Stock not found in portfolio' });
    }
    
    // i'm checking if the user has enough shares to sell
    // if they're trying to sell more than they own, i reject the transaction
    if (portfolio.stocks[stockIndex].shares < shares) {
      return res.status(400).json({ message: 'Not enough shares' });
    }
    
    // i'm adding the sale proceeds to the user's balance
    portfolio.balance += totalValue;
    
    // i'm reducing the number of shares the user owns by the amount they're selling
    portfolio.stocks[stockIndex].shares -= shares;
    
    // if the user sold all their shares of this stock, i remove it completely
    // this keeps the portfolio clean and only shows stocks they currently own
    if (portfolio.stocks[stockIndex].shares === 0) {
      // splice removes the stock from the array at the specified index
      portfolio.stocks.splice(stockIndex, 1);
    }
    
    // i'm recording this sell transaction in the transaction history
    // this maintains a complete record of all trading activity
    portfolio.transactions.push({ transactionType: 'sell', symbol, shares, price });
    
    // i'm saving all the changes to the database
    await portfolio.save();
    
    // i'm sending back the updated portfolio so the frontend can update the display
    res.json(portfolio);
  } catch (err) {
    // if anything goes wrong during the sell process, i catch the error
    // status 400 indicates a client error, like trying to sell stocks they don't own
    res.status(400).json({ message: err.message });
  }
});

// i'm exporting the router so i can use these portfolio routes in my main server file
// this keeps my code organized and modular
module.exports = router;