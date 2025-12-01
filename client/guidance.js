// ========================================
// user information and authentication
// ========================================

/**
 * loads and displays user information from browser's local storage
 * gets the stored username and updates the navigation bar
 */
function loadUserInfo() {
    const userName = localStorage.getItem('userName') || 'Guest'; // gets stored name or defaults to 'guest'
    const isGuest = localStorage.getItem('isGuest') === 'true'; // checks if user is browsing as guest
    
    // updates the username display in the navigation bar
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
// flowchart data structure
// based on irish personal finance flowchart methodology
// ========================================

/**
 * array containing all flowchart steps with questions, explanations, and navigation logic
 * each step represents a key decision point in financial planning
 */
const flowchartSteps = [
    {
        step: 1,
        question: "Step 1: Do you have a budget?",
        explanation: "A budget helps you track income and expenses, ensuring you're spending less than you earn.",
        options: [
            { text: "Yes, I have a budget", next: 2 }, // proceeds to next step
            { text: "No, I don't have a budget", advice: "createBudget" } // shows specific advice
        ]
    },
    {
        step: 2,
        question: "Step 2: Do you have high-interest debt?",
        explanation: "High-interest debt (credit cards, payday loans) should be prioritized as it grows quickly.",
        options: [
            { text: "Yes, I have high-interest debt", advice: "payOffDebt" },
            { text: "No high-interest debt", next: 3 }
        ]
    },
    {
        step: 3,
        question: "Step 3: Do you have an emergency fund?",
        explanation: "An emergency fund (3-6 months of expenses) protects you from unexpected costs.",
        options: [
            { text: "Yes, I have 3-6 months saved", next: 4 },
            { text: "No, or less than 3 months", advice: "buildEmergencyFund" }
        ]
    },
    {
        step: 4,
        question: "Step 4: Are you contributing to retirement?",
        explanation: "Taking advantage of employer matching and tax-advantaged accounts is crucial for long-term wealth.",
        options: [
            { text: "Yes, I'm contributing to retirement", next: 5 },
            { text: "No retirement contributions yet", advice: "startRetirement" }
        ]
    },
    {
        step: 5,
        question: "Step 5: Do you have any moderate-interest debt?",
        explanation: "Debt with 4-7% interest (student loans, car loans) should be evaluated against investment returns.",
        options: [
            { text: "Yes, I have moderate debt", advice: "moderateDebt" },
            { text: "No moderate debt", next: 6 }
        ]
    },
    {
        step: 6,
        question: "Step 6: Are you maximizing tax-advantaged accounts?",
        explanation: "401(k), IRA, HSA contributions reduce taxable income and grow tax-free.",
        options: [
            { text: "Yes, I'm maxing them out", next: 7 },
            { text: "No, I can contribute more", advice: "maxTaxAdvantaged" }
        ]
    },
    {
        step: 7,
        question: "Step 7: Ready to invest for long-term growth?",
        explanation: "With basics covered, you can focus on building wealth through diversified investments.",
        options: [
            { text: "Yes, tell me about investing", advice: "startInvesting" },
            { text: "I want to review my plan", advice: "comprehensiveReview" }
        ]
    }
];

// ========================================
// advice templates
// detailed financial guidance for each scenario
// ========================================

/**
 * object containing comprehensive advice templates for different financial situations
 * each template includes title, sections with action points, and next steps
 */
const adviceTemplates = {
    // advice for users without a budget
    createBudget: {
        title: "Priority: Create a Budget",
        sections: [
            {
                heading: "Why This Matters",
                points: [
                    "A budget is the foundation of financial health",
                    "Helps you understand where your money goes",
                    "Ensures you spend less than you earn",
                    "Identifies areas to cut back and save more"
                ]
            },
            {
                heading: "Action Steps",
                points: [
                    "Track all income sources (salary, side hustles, etc.)",
                    "List all expenses for the past 3 months",
                    "Categorize expenses: needs, wants, savings",
                    "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
                    "Use budgeting apps like Mint or YNAB to automate tracking"
                ]
            }
        ],
        nextStep: "Once you have a budget and are spending less than you earn, move to Step 2: Tackling high-interest debt."
    },
    
    // advice for users with high-interest debt
    payOffDebt: {
        title: "Priority: Eliminate High-Interest Debt",
        sections: [
            {
                heading: "Why This Matters",
                points: [
                    "Credit card debt often has 15-25% interest rates",
                    "This interest compounds quickly, making it harder to escape",
                    "Paying this off gives you a guaranteed 'return' equal to the interest rate",
                    "Frees up cash flow for other financial goals"
                ]
            },
            {
                heading: "Action Steps",
                points: [
                    "List all debts with interest rates",
                    "Pay minimum on all debts to avoid penalties",
                    "Put extra money toward highest-interest debt first (avalanche method)",
                    "Consider balance transfer to 0% APR card if you have good credit",
                    "Avoid taking on new high-interest debt"
                ]
            }
        ],
        nextStep: "After eliminating high-interest debt, build your emergency fund (Step 3)."
    },
    
    // advice for building emergency savings
    buildEmergencyFund: {
        title: "Priority: Build Emergency Fund",
        sections: [
            {
                heading: "Why This Matters",
                points: [
                    "Life is unpredictable: job loss, medical bills, car repairs",
                    "Without savings, emergencies lead to debt",
                    "Provides peace of mind and financial stability",
                    "Prevents you from derailing other financial goals"
                ]
            },
            {
                heading: "Action Steps",
                points: [
                    "Start with $1,000 as a starter emergency fund",
                    "Then build to 3-6 months of essential expenses",
                    "Keep it in a high-yield savings account (easy access, earns interest)",
                    "Automate monthly transfers to this account",
                    "Only use for true emergencies, then replenish"
                ]
            }
        ],
        nextStep: "With an emergency fund in place, start contributing to retirement (Step 4)."
    },
    
    // advice for starting retirement savings
    startRetirement: {
        title: "Priority: Start Retirement Contributions",
        sections: [
            {
                heading: "Why This Matters",
                points: [
                    "Time is your greatest asset in investing",
                    "Compound growth means money invested early grows exponentially",
                    "Employer matching is free money (100% instant return)",
                    "Tax advantages reduce your current tax bill"
                ]
            },
            {
                heading: "Action Steps",
                points: [
                    "Contribute at least enough to get full employer match (if offered)",
                    "Open a 401(k) through your employer",
                    "If no 401(k), open a Roth IRA or Traditional IRA",
                    "Start with at least 10-15% of gross income",
                    "Invest in low-cost index funds (target-date funds are great for beginners)"
                ]
            }
        ],
        nextStep: "Once you're contributing to retirement, evaluate moderate-interest debt (Step 5)."
    },
    
    // advice for managing moderate-interest debt
    moderateDebt: {
        title: "Evaluate Moderate-Interest Debt",
        sections: [
            {
                heading: "Why This Matters",
                points: [
                    "Debt at 4-7% interest is a gray area",
                    "Stock market averages 7-10% returns historically",
                    "It's often better to invest than pay off this debt aggressively",
                    "Balance paying down debt with building wealth"
                ]
            },
            {
                heading: "Action Steps",
                points: [
                    "Continue making regular payments on these loans",
                    "Don't rush to pay them off early",
                    "Focus on investing extra money in retirement accounts",
                    "If debt causes stress, split extra money 50/50 between debt and investing",
                    "Refinance if you can get a lower rate"
                ]
            }
        ],
        nextStep: "Continue to Step 6: Maximizing tax-advantaged accounts."
    },
    
    // advice for maximizing tax-advantaged retirement accounts
    maxTaxAdvantaged: {
        title: "Maximize Tax-Advantaged Accounts",
        sections: [
            {
                heading: "Why This Matters",
                points: [
                    "Contributions to 401(k) and IRA reduce taxable income",
                    "Money grows tax-free until retirement",
                    "HSA is triple tax-advantaged (tax-free in, growth, and out)",
                    "Maximizes long-term wealth building"
                ]
            },
            {
                heading: "Action Steps",
                points: [
                    "Max out 401(k) ($23,000/year for 2024)",
                    "Max out IRA ($7,000/year for 2024)",
                    "If you have an HSA, contribute the max ($4,150 individual, $8,300 family)",
                    "Consider backdoor Roth IRA if income is too high",
                    "Invest contributions in diversified index funds"
                ]
            }
        ],
        nextStep: "Once tax-advantaged accounts are maxed, invest in taxable accounts (Step 7)."
    },
    
    // advice for beginning investment strategy
    startInvesting: {
        title: "Build Wealth Through Investing",
        sections: [
            {
                heading: "Why This Matters",
                points: [
                    "You've covered the basics - now focus on wealth building",
                    "Investing in stocks historically returns 7-10% annually",
                    "Diversification protects against risk",
                    "Time in the market beats timing the market"
                ]
            },
            {
                heading: "Action Steps",
                points: [
                    "Open a taxable brokerage account (Vanguard, Fidelity, Schwab)",
                    "Invest in low-cost index funds (S&P 500, total market)",
                    "Consider 3-fund portfolio: US stocks, international stocks, bonds",
                    "Set up automatic monthly investments (dollar-cost averaging)",
                    "Don't panic during market downturns - stay the course",
                    "Review portfolio annually, rebalance as needed"
                ]
            }
        ],
        nextStep: "You're on the path to financial independence! Consider exploring real estate, side businesses, or other advanced strategies."
    },
    
    // comprehensive review for financially stable users
    comprehensiveReview: {
        title: "Comprehensive Financial Health Check",
        sections: [
            {
                heading: "You're Doing Great!",
                points: [
                    "You have a budget and live below your means",
                    "No high-interest debt",
                    "Emergency fund is fully funded",
                    "Contributing to retirement accounts",
                    "Managing moderate debt wisely",
                    "Maximizing tax-advantaged accounts"
                ]
            },
            {
                heading: "Areas to Consider",
                points: [
                    "Increase retirement contributions if possible",
                    "Explore taxable investing for additional growth",
                    "Consider life insurance and estate planning",
                    "Optimize tax strategy with a professional",
                    "Explore real estate or alternative investments",
                    "Plan for major life expenses (home, education, etc.)"
                ]
            }
        ],
        nextStep: "Keep reviewing and adjusting your plan annually. You're well on your way to financial freedom!"
    }
};

// ========================================
// flowchart state management
// ========================================

// tracks which step the user is currently on (0-indexed)
let currentFlowchartStep = 0;

// array storing the path the user has taken through the flowchart
let flowchartPath = [];

// ========================================
// flowchart functions
// ========================================

/**
 * initializes and displays the interactive flowchart
 * hides the main menu and shows the flowchart interface
 */
function startFlowchart() {
    // hides the introduction and options sections
    document.getElementById('introSection').style.display = 'none';
    document.getElementById('optionsSection').style.display = 'none';
    
    // shows the flowchart section
    document.getElementById('flowchartSection').style.display = 'block';
    
    // resets flowchart state to beginning
    currentFlowchartStep = 0;
    flowchartPath = [];
    
    // displays the first step
    displayFlowchartStep(flowchartSteps[0]);
}

/**
 * renders a flowchart step with its question, explanation, and options
 * updates progress bar and builds html for the step content
 * @param {Object} stepData - the data object for the current step
 */
function displayFlowchartStep(stepData) {
    // gets the container where we'll insert the step content
    const content = document.getElementById('flowchartContent');
    
    // extracts step number for progress calculation
    const stepNum = stepData.step;
    
    // calculates progress percentage (out of 7 total steps)
    const progress = (stepNum / 7) * 100;
    
    // updates progress indicators in the ui
    document.getElementById('currentStep').textContent = stepNum;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressPercent').textContent = Math.round(progress);
    
    // builds html for the step using template literals
    content.innerHTML = `
        <div class="flowchart-step">
            <div class="step-number">Step ${stepData.step}</div>
            <h2 class="step-question">${stepData.question}</h2>
            <p class="step-explanation">${stepData.explanation}</p>
            <div class="step-options">
                ${stepData.options.map((option, index) => `
                    <button class="step-option-btn" onclick="handleFlowchartChoice(${index})">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    // adds current step to the path history
    flowchartPath.push(stepData);
}

/**
 * handles user's choice in the flowchart
 * either navigates to next step or displays final advice
 * @param {number} optionIndex - index of the option the user selected
 */
function handleFlowchartChoice(optionIndex) {
    // gets the data for the current step
    const currentStep = flowchartPath[flowchartPath.length - 1];
    
    // gets the specific option that was selected
    const choice = currentStep.options[optionIndex];
    
    // checks if this choice leads to advice or another step
    if (choice.advice) {
        // displays the appropriate advice template
        showFlowchartAdvice(choice.advice);
    } else if (choice.next !== undefined) {
        // finds and displays the next step
        const nextStep = flowchartSteps.find(s => s.step === choice.next);
        displayFlowchartStep(nextStep);
    }
}

/**
 * displays the final advice page based on user's answers
 * builds comprehensive html with sections, points, and next steps
 * @param {string} adviceKey - key corresponding to advice template
 */
function showFlowchartAdvice(adviceKey) {
    // gets the appropriate advice template
    const advice = adviceTemplates[adviceKey];
    
    // gets the container where we'll display the advice
    const content = document.getElementById('flowchartContent');
    
    // starts building the advice html
    let html = `
        <div class="flowchart-advice">
            <div class="advice-header">
                <h2>${advice.title}</h2>
                <p style="color: var(--navy-blue); font-size: 16px;">Based on your financial situation, here's what you should focus on</p>
            </div>
    `;
    
    // loops through each section and adds it to the html
    advice.sections.forEach(section => {
        html += `
            <div class="advice-section">
                <h3>${section.heading}</h3>
                <ul>
                    ${section.points.map(point => `<li>${point}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    
    // adds the "what's next?" section and restart button
    html += `
        <div class="info-callout">
            <strong>What's Next?</strong>
            ${advice.nextStep}
        </div>
        <div style="text-align: center; margin-top: 32px;">
            <button class="btn btn-primary" onclick="startFlowchart()">
                Start Over
            </button>
        </div>
        <div style="text-align: center; margin-top: 16px; font-size: 14px; color: var(--navy-blue);">
            <p>Based on the <a href="https://www.reddit.com/r/irishpersonalfinance/" target="_blank" style="color: var(--primary-blue);">Irish Personal Finance</a> flowchart</p>
        </div>
    </div>
    `;
    
    // inserts the complete html into the page
    content.innerHTML = html;
}

// ========================================
// questionnaire data and state
// ========================================

/**
 * array of questions for the quick questionnaire
 * each question has text and multiple choice options
 */
const questions = [
    {
        text: "What is your primary financial goal?",
        options: [
            { text: "Saving for retirement", value: "retirement" },
            { text: "Building an emergency fund", value: "emergency" },
            { text: "Paying off debt", value: "debt" },
            { text: "Investing for growth", value: "investing" }
        ]
    },
    {
        text: "How much do you currently have in savings?",
        options: [
            { text: "Less than $1,000", value: "low" },
            { text: "$1,000 - $5,000", value: "medium" },
            { text: "$5,000 - $10,000", value: "high" },
            { text: "More than $10,000", value: "veryhigh" }
        ]
    },
    {
        text: "What is your risk tolerance for investments?",
        options: [
            { text: "Conservative - I prefer stability", value: "conservative" },
            { text: "Moderate - Balanced approach", value: "moderate" },
            { text: "Aggressive - I can handle volatility", value: "aggressive" }
        ]
    },
    {
        text: "Do you have any high-interest debt?",
        options: [
            { text: "Yes, significant debt (>$5,000)", value: "high" },
            { text: "Yes, some debt (<$5,000)", value: "some" },
            { text: "No debt", value: "none" }
        ]
    },
    {
        text: "What is your investment timeline?",
        options: [
            { text: "Short-term (0-3 years)", value: "short" },
            { text: "Medium-term (3-10 years)", value: "medium" },
            { text: "Long-term (10+ years)", value: "long" }
        ]
    }
];

// tracks which question is currently being displayed
let currentQuestion = 0;

// object to store user's answers (key-value pairs)
let answers = {};

// stores the currently selected answer before moving to next question
let selectedAnswer = null;

// ========================================
// questionnaire functions
// ========================================

/**
 * initializes and starts the questionnaire
 * hides menu and displays first question
 */
function startQuestionnaire() {
    // hides introduction and options
    document.getElementById('introSection').style.display = 'none';
    document.getElementById('optionsSection').style.display = 'none';
    
    // shows questionnaire section
    document.getElementById('questionnaireSection').style.display = 'block';
    
    // resets questionnaire state
    currentQuestion = 0;
    answers = {};
    selectedAnswer = null;
    
    // displays the first question
    displayQuestion();
}

/**
 * renders the current question and its options
 * updates question number, text, and answer buttons
 */
function displayQuestion() {
    // gets the current question object
    const question = questions[currentQuestion];
    
    // updates the question counter display
    document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    
    // updates the question text
    document.getElementById('questionText').textContent = question.text;
    
    // gets the container for answer options
    const optionsGroup = document.getElementById('optionsGroup');
    
    // generates html for all option buttons using map and join
    optionsGroup.innerHTML = question.options.map((option, index) => `
        <button class="option-button" onclick="selectOption(this, '${option.value}')">
            ${option.text}
        </button>
    `).join('');
    
    // shows/hides previous button (hidden on first question)
    document.getElementById('prevBtn').style.display = currentQuestion === 0 ? 'none' : 'inline-block';
    
    // changes next button text to "get advice" on final question
    document.getElementById('nextBtn').textContent = currentQuestion === questions.length - 1 ? 'Get Advice' : 'Next Question';
}

/**
 * handles user selecting an answer option
 * highlights selected button and stores the value
 * @param {HTMLElement} element - the button that was clicked
 * @param {string} value - the value associated with this option
 */
function selectOption(element, value) {
    // removes 'selected' class from all buttons
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // adds 'selected' class to the clicked button
    element.classList.add('selected');
    
    // stores the selected value
    selectedAnswer = value;
}

/**
 * advances to the next question or shows results
 * validates that an answer is selected before proceeding
 */
function nextQuestion() {
    // checks if user has selected an answer
    if (selectedAnswer === null) {
        alert('Please select an option');
        return;
    }
    
    // stores the answer in the answers object
    answers[`question${currentQuestion}`] = selectedAnswer;
    
    // resets selected answer for next question
    selectedAnswer = null;
    
    // checks if there are more questions
    if (currentQuestion < questions.length - 1) {
        // moves to next question
        currentQuestion++;
        displayQuestion();
    } else {
        // all questions answered, shows results
        showResults();
    }
}

/**
 * goes back to the previous question
 * restores the previously selected answer
 */
function previousQuestion() {
    // only goes back if not on first question
    if (currentQuestion > 0) {
        // moves back one question
        currentQuestion--;
        
        // retrieves the previously selected answer
        selectedAnswer = answers[`question${currentQuestion}`];
        
        // re-displays the previous question
        displayQuestion();
        
        // if there was a previous answer, highlights it
        if (selectedAnswer) {
            const buttons = document.querySelectorAll('.option-button');
            buttons.forEach(btn => {
                // checks if button text includes the selected value
                if (btn.textContent.includes(selectedAnswer)) {
                    btn.classList.add('selected');
                }
            });
        }
    }
}

/**
 * displays the results page with personalized advice
 * hides the question interface and shows the advice content
 */
function showResults() {
    // hides the question card
    document.getElementById('questionCard').classList.add('hidden');
    
    // hides navigation buttons
    document.querySelector('#questionnaireSection .flex').classList.add('hidden');
    
    // shows results section
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // generates advice based on answers
    let advice = generateAdvice(answers);
    
    // inserts the advice html into the results section
    document.getElementById('adviceContent').innerHTML = advice;
}

/**
 * generates personalized financial advice based on questionnaire answers
 * analyzes user responses and builds tailored recommendations
 * @param {Object} answers - object containing all user answers
 * @returns {string} html string with personalized advice
 */
function generateAdvice(answers) {
    // starts building the advice html
    let advice = '<div style="background: white; padding: 28px; border-radius: 16px; margin-bottom: 20px;">';
    advice += '<h3 style="color: var(--dark-blue); margin-bottom: 16px; font-size: 24px;">Your Financial Recommendations</h3>';
    advice += '<ul style="list-style: none; padding: 0;">';

    // checks primary goal and adds relevant advice
    if (answers.question0 === 'emergency') {
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Priority:</strong> Build an emergency fund of 3-6 months of expenses</li>';
    } else if (answers.question0 === 'retirement') {
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Priority:</strong> Maximize retirement contributions (401k, IRA)</li>';
    }

    // checks debt status and adds advice
    if (answers.question3 === 'high' || answers.question3 === 'some') {
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Important:</strong> Focus on paying off high-interest debt first</li>';
    }

    // checks risk tolerance and recommends investment style
    if (answers.question2 === 'aggressive') {
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Investment Style:</strong> Consider growth-focused stock portfolios</li>';
    } else if (answers.question2 === 'conservative') {
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Investment Style:</strong> Focus on bonds and stable dividend stocks</li>';
    }

    // closes the list and container
    advice += '</ul></div>';
    
    return advice;
}

/**
 * resets the questionnaire to start over
 * returns user to the first question
 */
function restartQuestionnaire() {
    // hides results section
    document.getElementById('resultsSection').classList.add('hidden');
    
    // shows question card
    document.getElementById('questionCard').classList.remove('hidden');
    
    // shows navigation buttons
    document.querySelector('#questionnaireSection .flex').classList.remove('hidden');
    
    // resets all state variables
    currentQuestion = 0;
    answers = {};
    selectedAnswer = null;
    
    // displays first question
    displayQuestion();
}

// ========================================
// navigation functions
// ========================================

/**
 * returns user to the main options menu
 * hides both flowchart and questionnaire sections
 */
function backToOptions() {
    // hides flowchart section
    document.getElementById('flowchartSection').style.display = 'none';
    
    // hides questionnaire section
    document.getElementById('questionnaireSection').style.display = 'none';
    
    // shows introduction section
    document.getElementById('introSection').style.display = 'block';
    
    // shows options section with grid layout
    document.getElementById('optionsSection').style.display = 'grid';
}

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
 * initializes user information display in the navbar
 */
window.addEventListener('DOMContentLoaded', loadUserInfo);