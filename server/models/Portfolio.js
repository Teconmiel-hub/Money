// i'm importing mongoose to help me interact with mongodb
// this library simplifies database operations and data modeling
const mongoose = require('mongoose');

// here i'm defining the schema for my portfolio model
// this schema represents a user's investment portfolio with their stocks and transaction history
const portfolioSchema = new mongoose.Schema({
  
  // the userid field identifies which user owns this portfolio
  userId: {
    // i'm using string type to store the user identifier
    type: String,
    
    // i set a default value in case no userid is provided when creating a portfolio
    // this prevents errors during testing or initial setup
    default: 'default-user'
  },
  
  // the balance field tracks how much cash the user has available
  balance: {
    // i'm using number type because balance is a monetary value
    type: Number,
    
    // i'm giving users $10,000 to start with as their initial balance
    // this is like a starting amount for paper trading or practice
    default: 10000
  },
  
  // the stocks field is an array that holds all the stocks the user currently owns
  // i'm using an array because users can own multiple different stocks
  stocks: [{
    // the symbol field stores the stock ticker symbol (like "aapl" for apple)
    symbol: String,
    
    // the name field stores the full company name for easier reading
    name: String,
    
    // the shares field tracks how many shares of this stock the user owns
    shares: Number,
    
    // the purchaseprice field records the price per share when the user bought it
    // this helps me calculate profit or loss later
    purchasePrice: Number,
    
    // the purchasedate field records when the user bought this stock
    purchaseDate: {
      // i'm using date type to store the exact timestamp
      type: Date,
      
      // i set date.now as default so it automatically records when the purchase happened
      // this way i don't need to manually enter the date every time
      default: Date.now
    }
  }],
  
  // the transactions field is an array that stores the complete history of all trades
  // i need this to track every buy and sell action the user has made
  transactions: [{
    // the transactiontype field indicates whether this was a 'buy' or 'sell' action
    // i changed the name from 'type' to 'transactiontype' to avoid conflicts with mongoose reserved words
    transactionType: String,
    
    // the symbol field stores which stock was traded
    symbol: String,
    
    // the shares field records how many shares were bought or sold in this transaction
    shares: Number,
    
    // the price field stores the price per share at the time of this transaction
    price: Number,
    
    // the date field records when this transaction occurred
    date: {
      // i'm using date type for accurate timestamp storage
      type: Date,
      
      // i set date.now as default so each transaction is automatically timestamped
      // this creates a chronological record of all trading activity
      default: Date.now
    }
  }]
});

// i'm exporting this as a mongoose model named 'portfolio'
// mongoose will look for a collection called 'portfolios' in my database
// now i can use this model throughout my app to manage user portfolios
module.exports = mongoose.model('Portfolio', portfolioSchema);