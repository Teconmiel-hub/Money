// ========================================
// stock market data
// 15 companies across different sectors
// ========================================

/**
 * array of stock objects representing available companies
 * each stock has symbol, name, price, daily change percentage, and sector
 */
const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.3, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.30, change: 1.8, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.90, change: -0.5, sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.80, change: 3.2, sector: 'Automotive' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 1.5, sector: 'E-commerce' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.60, change: -1.2, sector: 'Technology' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.25, change: 4.5, sector: 'Technology' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.45, change: 0.8, sector: 'Finance' },
    { symbol: 'V', name: 'Visa Inc.', price: 267.80, change: 1.1, sector: 'Finance' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.90, change: -0.3, sector: 'Healthcare' },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 172.35, change: 0.6, sector: 'Retail' },
    { symbol: 'PG', name: 'Procter & Gamble', price: 165.20, change: 0.4, sector: 'Consumer Goods' },
    { symbol: 'DIS', name: 'The Walt Disney Company', price: 95.80, change: -1.8, sector: 'Entertainment' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 525.40, change: 2.9, sector: 'Entertainment' },
    { symbol: 'BA', name: 'Boeing Company', price: 178.90, change: -2.1, sector: 'Aerospace' }
];

// ========================================
// portfolio state management
// ========================================

/**
 * portfolio object that tracks user's cash and holdings
 * starts with $10,000 and empty holdings array
 */
let portfolio = {
    cash: 10000, // starting cash balance
    holdings: [] // array of owned stocks {symbol, name, shares, avgCost}
};

// ========================================
// initialization functions
// ========================================

/**
 * main initialization function that runs when page loads
 * sets up user info, renders all components, and loads saved data
 */
function init() {
    loadUserInfo(); // displays user name in navbar
    renderCompanyList(); // populates the company directory
    renderStocks(); // creates stock trading cards
    loadPortfolio(); // loads saved portfolio from local storage
    updateDashboard(); // updates all dashboard values
    setupTimeProjection(); // sets up projection calculator controls
}

/**
 * loads and displays user information from browser's local storage
 * shows username and avatar in the navigation bar
 */
function loadUserInfo() {
    const userName = localStorage.getItem('userName') || 'Guest'; // gets stored name or defaults to 'guest'
    const isGuest = localStorage.getItem('isGuest') === 'true'; // checks if user is browsing as guest
    
    // updates the username display in the navbar
    document.getElementById('userName').textContent = userName;
    
    const avatar = document.getElementById('userAvatar');
    if (isGuest) {
        avatar.textContent = 'G'; // shows 'g' for guest users
    } else {
        // shows first two letters of username as initials
        const initials = userName.substring(0, 2).toUpperCase();
        avatar.textContent = initials;
    }
}

// ========================================
// company directory functions
// ========================================

/**
 * renders the company directory grid with all available stocks
 * creates clickable cards that scroll to the stock's trading card
 */
function renderCompanyList() {
    const companyList = document.getElementById('companyList');
    
    // builds html for each company card
    companyList.innerHTML = stocks.map(stock => `
        <div class="company-item" onclick="scrollToStock('${stock.symbol}')">
            <div class="company-symbol">${stock.symbol}</div>
            <div class="company-name">${stock.name}</div>
            <div class="company-sector">${stock.sector}</div>
        </div>
    `).join('');
}

/**
 * scrolls the page to a specific stock's trading card
 * adds a quick animation effect to highlight the card
 * @param {string} symbol - the stock ticker symbol to scroll to
 */
function scrollToStock(symbol) {
    // finds the stock card element by its id
    const element = document.getElementById(`stock-${symbol}`);
    
    if (element) {
        // smoothly scrolls to center the element on screen
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // resets animation then triggers it again for visual feedback
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'fadeInUp 0.6s ease-out';
        }, 10);
    }
}

// ========================================
// stock trading card functions
// ========================================

/**
 * renders all stock trading cards in the grid
 * each card shows price, change, and buy controls
 */
function renderStocks() {
    const stocksGrid = document.getElementById('stocksGrid');
    
    // builds html for each stock card
    stocksGrid.innerHTML = stocks.map(stock => `
        <div class="stock-card" id="stock-${stock.symbol}">
            <!-- header with symbol and price -->
            <div class="stock-header">
                <div class="stock-symbol">${stock.symbol}</div>
                <div class="stock-price">$${stock.price.toFixed(2)}</div>
            </div>
            
            <!-- company name -->
            <div class="stock-name-small">${stock.name}</div>
            
            <!-- price change badge (green for up, blue for down) -->
            <div class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                ${stock.change >= 0 ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)}%
            </div>
            
            <!-- buy controls: quantity input and buy button -->
            <div class="stock-actions">
                <input type="number" class="stock-input" id="qty-${stock.symbol}" placeholder="Shares" min="1" value="1">
                <button class="btn btn-success" onclick="buyStock('${stock.symbol}')">Buy</button>
            </div>
        </div>
    `).join('');
}

// ========================================
// buying and selling functions
// ========================================

/**
 * handles buying shares of a stock
 * validates quantity and funds, then updates portfolio
 * @param {string} symbol - the stock ticker symbol to buy
 */
function buyStock(symbol) {
    // finds the stock data
    const stock = stocks.find(s => s.symbol === symbol);
    
    // gets the quantity entered by user
    const qty = parseInt(document.getElementById(`qty-${symbol}`).value) || 0;
    
    // validates quantity is positive
    if (qty <= 0) {
        alert('Please enter a valid quantity');
        return;
    }

    // calculates total cost
    const cost = stock.price * qty;
    
    // checks if user has enough cash
    if (cost > portfolio.cash) {
        alert(`Insufficient funds!\n\nYou need: $${cost.toFixed(2)}\nYou have: $${portfolio.cash.toFixed(2)}`);
        return;
    }

    // deducts cost from cash balance
    portfolio.cash -= cost;
    
    // checks if user already owns this stock
    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    
    if (holding) {
        // if already owned, updates average cost and share count
        const totalShares = holding.shares + qty;
        const totalCost = (holding.avgCost * holding.shares) + cost;
        holding.avgCost = totalCost / totalShares; // calculates new average cost
        holding.shares = totalShares;
    } else {
        // if new stock, adds it to holdings
        portfolio.holdings.push({
            symbol: symbol,
            name: stock.name,
            shares: qty,
            avgCost: stock.price // initial average cost is purchase price
        });
    }

    // saves portfolio, updates display, and resets input
    savePortfolio();
    updateDashboard();
    renderHoldings();
    document.getElementById(`qty-${symbol}`).value = '1'; // resets to 1 share
    
    // shows success message
    alert(`✅ Success!\n\nBought ${qty} shares of ${symbol}\nTotal cost: $${cost.toFixed(2)}`);
}

/**
 * handles selling all shares of a stock
 * calculates profit/loss and updates portfolio
 * @param {string} symbol - the stock ticker symbol to sell
 */
function sellStock(symbol) {
    // finds the holding
    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (!holding) return; // exits if stock not owned

    // finds current stock price
    const stock = stocks.find(s => s.symbol === symbol);
    
    // calculates sale revenue
    const revenue = stock.price * holding.shares;
    
    // calculates original cost basis
    const costBasis = holding.avgCost * holding.shares;
    
    // calculates profit or loss
    const profit = revenue - costBasis;
    
    // adds revenue to cash
    portfolio.cash += revenue;
    
    // removes stock from holdings
    portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);

    // saves and updates display
    savePortfolio();
    updateDashboard();
    renderHoldings();
    
    // shows success message with profit/loss
    alert(`✅ Sold!\n\nSold ${holding.shares} shares of ${symbol}\nRevenue: $${revenue.toFixed(2)}\nProfit/Loss: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
}

// ========================================
// holdings table functions
// ========================================

/**
 * renders the holdings table showing all owned stocks
 * displays shares, costs, current value, and profit/loss
 */
function renderHoldings() {
    const holdingsBody = document.getElementById('holdingsBody');
    
    // shows empty message if no holdings
    if (portfolio.holdings.length === 0) {
        holdingsBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--navy-blue); padding: 40px;">No holdings yet. Start by buying some stocks above!</td></tr>';
        return;
    }

    // builds table rows for each holding
    holdingsBody.innerHTML = portfolio.holdings.map(holding => {
        // gets current stock data
        const stock = stocks.find(s => s.symbol === holding.symbol);
        
        // calculates current value
        const currentValue = stock.price * holding.shares;
        
        // calculates original cost
        const costBasis = holding.avgCost * holding.shares;
        
        // calculates gain/loss in dollars
        const gainLoss = currentValue - costBasis;
        
        // calculates gain/loss as percentage
        const gainLossPercent = (gainLoss / costBasis) * 100;

        return `
            <tr>
                <td><span class="stock-symbol">${holding.symbol}</span></td>
                <td>${holding.name}</td>
                <td>${holding.shares}</td>
                <td>$${holding.avgCost.toFixed(2)}</td>
                <td><span class="stock-price">$${stock.price.toFixed(2)}</span></td>
                <td>$${currentValue.toFixed(2)}</td>
                <!-- gain/loss colored green for profit, blue for loss -->
                <td style="color: ${gainLoss >= 0 ? 'var(--bright-green)' : 'var(--primary-blue)'}; font-weight: 800;">
                    ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)} (${gainLossPercent.toFixed(2)}%)
                </td>
                <td>
                    <button class="btn btn-danger" onclick="sellStock('${holding.symbol}')">Sell All</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ========================================
// dashboard update functions
// ========================================

/**
 * updates all dashboard cards with current portfolio values
 * recalculates total value, invested amount, and gain/loss
 */
function updateDashboard() {
    // calculates current value of all holdings
    const holdingsValue = portfolio.holdings.reduce((sum, holding) => {
        const stock = stocks.find(s => s.symbol === holding.symbol);
        return sum + (stock.price * holding.shares);
    }, 0);

    // calculates total portfolio value (cash + holdings)
    const totalValue = portfolio.cash + holdingsValue;
    
    // calculates total amount invested (original cost of holdings)
    const totalInvested = portfolio.holdings.reduce((sum, holding) => {
        return sum + (holding.avgCost * holding.shares);
    }, 0);
    
    // calculates overall gain/loss
    const gainLoss = holdingsValue - totalInvested;

    // updates dashboard displays
    document.getElementById('portfolioValue').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('cashBalance').textContent = `$${portfolio.cash.toFixed(2)}`;
    document.getElementById('totalInvested').textContent = `$${totalInvested.toFixed(2)}`;
    
    // updates gain/loss with appropriate color
    const gainLossElement = document.getElementById('totalGainLoss');
    gainLossElement.textContent = `${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)}`;
    gainLossElement.className = gainLoss >= 0 ? 'dashboard-value positive' : 'dashboard-value negative';

    // updates projection calculation
    updateProjection();
}

// ========================================
// projection calculator functions
// ========================================

/**
 * sets up the time projection calculator controls
 * handles switching between days/weeks/months and slider changes
 */
function setupTimeProjection() {
    const slider = document.getElementById('timeSlider');
    const timeValue = document.getElementById('timeValue');
    const timeButtons = document.querySelectorAll('.time-btn');

    // tracks current time unit (days, weeks, or months)
    let currentUnit = 'days';
    
    // maximum values for each time unit
    let maxValues = { days: 365, weeks: 52, months: 24 };

    // sets up click handlers for time unit buttons
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // removes active class from all buttons
            timeButtons.forEach(b => b.classList.remove('active'));
            
            // adds active class to clicked button
            this.classList.add('active');
            
            // updates current unit
            currentUnit = this.dataset.unit;
            
            // updates slider max value based on unit
            slider.max = maxValues[currentUnit];
            
            // sets appropriate default value for each unit
            slider.value = currentUnit === 'days' ? 30 : currentUnit === 'weeks' ? 4 : 3;
            
            // updates unit label
            document.getElementById('timeUnit').textContent = currentUnit;
            
            // recalculates projection
            updateSliderValue();
        });
    });

    // listens for slider changes
    slider.addEventListener('input', updateSliderValue);

    /**
     * updates the displayed slider value and recalculates projection
     */
    function updateSliderValue() {
        timeValue.textContent = slider.value; // updates number display
        updateProjection(); // recalculates projected value
    }
}

/**
 * calculates and displays projected portfolio value based on time period
 * uses 8% annual return as historical market average
 */
function updateProjection() {
    const slider = document.getElementById('timeSlider');
    
    // gets currently selected time unit
    const currentUnit = document.querySelector('.time-btn.active').dataset.unit;
    
    // gets selected time value from slider
    const timeValue = parseInt(slider.value);

    // calculates current value of holdings
    const holdingsValue = portfolio.holdings.reduce((sum, holding) => {
        const stock = stocks.find(s => s.symbol === holding.symbol);
        return sum + (stock.price * holding.shares);
    }, 0);

    // calculates total portfolio value
    const totalValue = portfolio.cash + holdingsValue;

    // converts time period to days for calculation
    let days;
    if (currentUnit === 'days') {
        days = timeValue;
    } else if (currentUnit === 'weeks') {
        days = timeValue * 7; // 7 days per week
    } else {
        days = timeValue * 30; // approximately 30 days per month
    }

    // calculates projected value using compound interest
    const annualReturn = 0.08; // 8% annual return
    const dailyReturn = Math.pow(1 + annualReturn, 1/365) - 1; // converts to daily rate
    const projectedValue = totalValue * Math.pow(1 + dailyReturn, days); // compounds daily
    
    // calculates growth amount and percentage
    const growth = projectedValue - totalValue;
    const growthPercent = totalValue > 0 ? (growth / totalValue) * 100 : 0;

    // updates projection display
    document.getElementById('projectedValue').textContent = `$${projectedValue.toFixed(2)}`;
    
    // updates growth display with appropriate color
    const growthElement = document.getElementById('projectedGrowth');
    growthElement.textContent = `${growth >= 0 ? '+' : ''}$${growth.toFixed(2)} (${growthPercent.toFixed(2)}%)`;
    growthElement.className = growth >= 0 ? 'projection-growth' : 'projection-growth negative';
}

// ========================================
// portfolio persistence functions
// ========================================

/**
 * saves current portfolio to browser's local storage
 * allows portfolio to persist between page reloads
 */
function savePortfolio() {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

/**
 * loads saved portfolio from browser's local storage
 * restores previous holdings if they exist
 */
function loadPortfolio() {
    const saved = localStorage.getItem('portfolio');
    
    if (saved) {
        // parses saved json and restores portfolio
        portfolio = JSON.parse(saved);
        
        // renders holdings table with restored data
        renderHoldings();
    }
}

// ========================================
// authentication functions
// ========================================

/**
 * handles user logout
 * confirms action, clears stored data, and redirects to login page
 */
function handleLogout() {
    // asks for confirmation before logging out
    if (confirm('Are you sure you want to logout?')) {
        // removes user data from local storage
        localStorage.removeItem('userName');
        localStorage.removeItem('isGuest');
        
        // redirects to login page
        window.location.href = 'login.html';
    }
}

// ========================================
// page initialization
// ========================================

/**
 * runs when the page finishes loading
 * initializes all components and displays
 */
window.addEventListener('DOMContentLoaded', init);