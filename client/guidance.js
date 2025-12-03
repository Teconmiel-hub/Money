// ========================================
// user information and authentication
// ========================================

/**
 * loads and displays user information from browser's local storage
 * gets the stored username and updates the navigation bar
 */
function loadUserInfo() {
    // first we try to get the username from storage, if nothing is there we use 'Guest' as default
    const userName = localStorage.getItem('userName') || 'Guest';
    
    // we check if the user chose to browse as a guest by looking at the isGuest value
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    // now we find the element that shows the username and change its text to the actual username
    document.getElementById('userName').textContent = userName;
    
    // we get the avatar element (the circle with letters inside)
    const avatar = document.getElementById('userAvatar');
    
    // if the user is a guest, we show just the letter 'G'
    if (isGuest) {
        avatar.textContent = 'G';
    } else {
        // if they're not a guest, we take the first two letters of their name and make them uppercase
        // so if the name is "john", we show "JO"
        const initials = userName.substring(0, 2).toUpperCase();
        avatar.textContent = initials;
    }
}




// ========================================
// flowchart data structure
// based on irish personal finance flowchart methodology found on reddit
// ========================================

/**
 * this is an array that holds all the steps in our financial flowchart
 * each step is an object with a question, explanation, and options
 * the options let the user choose what to do next - either go to another step or see advice
 */
const flowchartSteps = [
    {
        // this is step number 1
        step: 1,
        
        // the main question we ask the user
        question: "Step 1: Do you have a budget?",
        
        // we explain why this question matters
        explanation: "A budget helps you track income and expenses, ensuring you're spending less than you earn.",
        
        // these are the choices the user can pick
        options: [
            // if they say yes, we move them to step 2 using the 'next' property
            { text: "Yes, I have a budget", next: 2 },
            
            // if they say no, we show them advice using the 'advice' property
            // 'createBudget' is a key that points to specific advice in our adviceTemplates object
            { text: "No, I don't have a budget", advice: "createBudget" }
        ]
    },
    {
        // step 2 asks about debt
        step: 2,
        question: "Step 2: Do you have high-interest debt?",
        explanation: "High-interest debt (credit cards, payday loans) should be prioritized as it grows quickly.",
        options: [
            // if they have debt, show advice about paying it off
            { text: "Yes, I have high-interest debt", advice: "payOffDebt" },
            // if no debt, move to step 3
            { text: "No high-interest debt", next: 3 }
        ]
    },
    {
        // step 3 asks about emergency savings
        step: 3,
        question: "Step 3: Do you have an emergency fund?",
        explanation: "An emergency fund (3-6 months of expenses) protects you from unexpected costs.",
        options: [
            // if they have enough saved, go to step 4
            { text: "Yes, I have 3-6 months saved", next: 4 },
            // if not, show advice about building emergency fund
            { text: "No, or less than 3 months", advice: "buildEmergencyFund" }
        ]
    },
    {
        // step 4 checks retirement savings
        step: 4,
        question: "Step 4: Are you contributing to retirement?",
        explanation: "Taking advantage of employer matching and tax-advantaged accounts is crucial for long-term wealth.",
        options: [
            { text: "Yes, I'm contributing to retirement", next: 5 },
            { text: "No retirement contributions yet", advice: "startRetirement" }
        ]
    },
    {
        // step 5 looks at medium-level debt
        step: 5,
        question: "Step 5: Do you have any moderate-interest debt?",
        explanation: "Debt with 4-7% interest (student loans, car loans) should be evaluated against investment returns.",
        options: [
            { text: "Yes, I have moderate debt", advice: "moderateDebt" },
            { text: "No moderate debt", next: 6 }
        ]
    },
    {
        // step 6 asks about tax-advantaged accounts
        step: 6,
        question: "Step 6: Are you maximizing tax-advantaged accounts?",
        explanation: "401(k), IRA, HSA contributions reduce taxable income and grow tax-free.",
        options: [
            { text: "Yes, I'm maxing them out", next: 7 },
            { text: "No, I can contribute more", advice: "maxTaxAdvantaged" }
        ]
    },
    {
        // step 7 is about investing
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
 * this object holds all the detailed advice we show to users
 * each advice has a title, sections with bullet points, and a next step message
 * the keys like 'createBudget' match the advice values in our flowchart options
 */
const adviceTemplates = {
    // advice for people who don't have a budget yet
    createBudget: {
        // the main title shown at the top
        title: "Priority: Create a Budget",
        
        // sections is an array of different parts of the advice
        sections: [
            {
                // each section has a heading
                heading: "Why This Matters",
                // and a list of bullet points
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
        // this tells the user what to do after following this advice
        nextStep: "Once you have a budget and are spending less than you earn, move to Step 2: Tackling high-interest debt."
    },
    
    // advice for people with high-interest debt
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

// this variable keeps track of where we are in the flowchart
// we start at 0 (which means the first step in the array)
let currentFlowchartStep = 0;

// this array stores all the steps the user has visited
// we add each step to this array as they progress through the flowchart
let flowchartPath = [];

// ========================================
// flowchart functions
// ========================================

/**
 * this function starts the flowchart when the user clicks the flowchart button
 * it hides the main menu and shows the flowchart interface
 */
function startFlowchart() {
    // we hide the introduction text section
    document.getElementById('introSection').style.display = 'none';
    
    // we hide the two big buttons (flowchart and questionnaire options)
    document.getElementById('optionsSection').style.display = 'none';
    
    // we show the flowchart section which was hidden before
    document.getElementById('flowchartSection').style.display = 'block';
    
    // we reset everything back to the beginning
    currentFlowchartStep = 0;
    flowchartPath = [];
    
    // we display the first step (step 1 about budgets)
    displayFlowchartStep(flowchartSteps[0]);
}

/**
 * this function displays a single step of the flowchart on the screen
 * it shows the question, explanation, and creates buttons for the options
 * @param {Object} stepData - the step object we want to display
 */
function displayFlowchartStep(stepData) {
    // we get the main content area where we'll put everything
    const content = document.getElementById('flowchartContent');
    
    // we get the step number (1, 2, 3, etc.)
    const stepNum = stepData.step;
    
    // we calculate how far through the flowchart we are as a percentage
    // we divide by 7 because there are 7 total steps, then multiply by 100 to get a percentage
    const progress = (stepNum / 7) * 100;
    
    // we update the text that shows "step 1 of 7"
    document.getElementById('currentStep').textContent = stepNum;
    
    // we update the blue progress bar width to match our progress
    document.getElementById('progressBar').style.width = progress + '%';
    
    // we update the percentage number (like "14%" or "28%")
    document.getElementById('progressPercent').textContent = Math.round(progress);
    
    // now we build the html for this step using a template string
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
    
    // the map function loops through each option and creates a button for it
    // the index tells us if it's option 0, 1, etc.
    // when clicked, it calls handleFlowchartChoice with that index number
    // join('') puts all the buttons together into one string
    
    // we add this step to our path history so we remember where we've been
    flowchartPath.push(stepData);
}

/**
 * this function runs when the user clicks one of the option buttons
 * it figures out if we should show advice or go to the next step
 * @param {number} optionIndex - which button was clicked (0 for first, 1 for second, etc.)
 */
function handleFlowchartChoice(optionIndex) {
    // we get the last step in our path (the one we're currently on)
    const currentStep = flowchartPath[flowchartPath.length - 1];
    
    // we get the specific option that the user clicked
    const choice = currentStep.options[optionIndex];
    
    // now we check what type of option it is
    if (choice.advice) {
        // if it has an 'advice' property, we show the advice page
        showFlowchartAdvice(choice.advice);
    } else if (choice.next !== undefined) {
        // if it has a 'next' property, we find that step and display it
        // we use find to search through all steps and get the one with matching step number
        const nextStep = flowchartSteps.find(s => s.step === choice.next);
        displayFlowchartStep(nextStep);
    }
}

/**
 * this function displays the final advice page based on what the user needs
 * it takes an advice key and shows all the detailed information from adviceTemplates
 * @param {string} adviceKey - the key to look up in adviceTemplates (like 'createBudget')
 */
function showFlowchartAdvice(adviceKey) {
    // we get the advice object using the key
    const advice = adviceTemplates[adviceKey];
    
    // we get the content area where we'll display everything
    const content = document.getElementById('flowchartContent');
    
    // we start building the html string
    let html = `
        <div class="flowchart-advice">
            <div class="advice-header">
                <h2>${advice.title}</h2>
                <p style="color: var(--navy-blue); font-size: 16px;">Based on your financial situation, here's what you should focus on</p>
            </div>
    `;
    
    // now we loop through each section in the advice
    // each section has a heading and a list of points
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
    // the map function turns each point into a <li> tag
    // join('') combines them all together
    
    // we add the "what's next" box at the bottom
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
    
    // finally we put all this html into the page
    content.innerHTML = html;
}

// ========================================
// questionnaire data and state
// ========================================

/**
 * this array holds all 5 questions for the quick questionnaire
 * each question has text and multiple options the user can choose from
 */
const questions = [
    {
        // the question text
        text: "What is your primary financial goal?",
        // the possible answers
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

// this tracks which question number we're on (starts at 0 for the first question)
let currentQuestion = 0;

// this object stores all the user's answers
// we'll store them like: { question0: "retirement", question1: "low", etc. }
let answers = {};

// this holds the answer the user selected for the current question
// it starts as null (nothing selected)
let selectedAnswer = null;

// ========================================
// questionnaire functions
// ========================================

/**
 * this function starts the questionnaire when the user clicks the questionnaire button
 * it hides the menu and shows the first question
 */
function startQuestionnaire() {
    // we hide the introduction section
    document.getElementById('introSection').style.display = 'none';
    
    // we hide the two option buttons
    document.getElementById('optionsSection').style.display = 'none';
    
    // we show the questionnaire section
    document.getElementById('questionnaireSection').style.display = 'block';
    
    // we reset everything to the beginning
    currentQuestion = 0;
    answers = {};
    selectedAnswer = null;
    
    // we show the first question
    displayQuestion();
}

/**
 * this function displays the current question and its answer options
 * it updates the question number, text, and creates buttons for each option
 */
function displayQuestion() {
    // we get the current question object from our questions array
    const question = questions[currentQuestion];
    
    // we update the text that shows "question 1 of 5"
    // we add 1 because currentQuestion starts at 0 but we want to show "1" to the user
    document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    
    // we update the question text
    document.getElementById('questionText').textContent = question.text;
    
    // we get the container where the option buttons will go
    const optionsGroup = document.getElementById('optionsGroup');
    
    // we create html for all the option buttons
    optionsGroup.innerHTML = question.options.map((option, index) => `
        <button class="option-button" onclick="selectOption(this, '${option.value}')">
            ${option.text}
        </button>
    `).join('');
    // map creates a button for each option
    // 'this' refers to the button element that gets clicked
    // option.value is the answer value we want to save
    
    // we hide the previous button if we're on the first question
    document.getElementById('prevBtn').style.display = currentQuestion === 0 ? 'none' : 'inline-block';
    
    // on the last question, we change the next button text to "get advice"
    document.getElementById('nextBtn').textContent = currentQuestion === questions.length - 1 ? 'Get Advice' : 'Next Question';
}

/**
 * this function runs when the user clicks one of the answer buttons
 * it highlights the selected button and stores the answer value
 * @param {HTMLElement} element - the button that was clicked
 * @param {string} value - the answer value to store (like "retirement" or "low")
 */
function selectOption(element, value) {
    // first we remove the 'selected' class from all buttons
    // this makes sure only one button is highlighted at a time
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // then we add the 'selected' class to the button that was just clicked
    // this makes it look highlighted
    element.classList.add('selected');
    
    // we save the answer value so we know what the user picked
    selectedAnswer = value;
}

/**
 * this function moves to the next question or shows the results
 * it first checks if the user selected an answer
 */
function nextQuestion() {
    // we check if the user picked an answer
    if (selectedAnswer === null) {
        // if they didn't, we show an alert asking them to select one
        alert('Please select an option');
        return; // we stop here and don't continue
    }
    
    // we save the answer in our answers object
    // the key is "question" plus the number, like "question0", "question1", etc.
    answers[`question${currentQuestion}`] = selectedAnswer;
    
    // we reset the selected answer for the next question
    selectedAnswer = null;
    
    // we check if there are more questions left
    if (currentQuestion < questions.length - 1) {
        // if yes, we move to the next question
        currentQuestion++;
        displayQuestion();
    } else {
        // if no more questions, we show the results page
        showResults();
    }
}

/**
 * this function goes back to the previous question
 * it restores the answer the user selected before
 */
function previousQuestion() {
    // we only go back if we're not on the first question
    if (currentQuestion > 0) {
        // we move back one question
        currentQuestion--;
        
        // we get the answer they selected for this question before
        selectedAnswer = answers[`question${currentQuestion}`];
        
        // we display the previous question again
        displayQuestion();
        
        // if there was a previous answer, we highlight that button
        if (selectedAnswer) {
            const buttons = document.querySelectorAll('.option-button');
            buttons.forEach(btn => {
                // we check if the button's value matches the saved answer
                if (btn.textContent.includes(selectedAnswer)) {
                    btn.classList.add('selected');
                }
            });
        }
    }
}

/**
 * this function displays the results page after all questions are answered
 * it hides the questions and shows the personalized advice
 */
function showResults() {
    // we hide the question card that shows the questions
    document.getElementById('questionCard').classList.add('hidden');
    
    // we hide the navigation buttons (previous and next)
    document.querySelector('#questionnaireSection .flex').classList.add('hidden');
    
    // we show the results section that was hidden
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // we generate the personalized advice based on all the answers
    let advice = generateAdvice(answers);
    
    // we put the advice html into the results section
    document.getElementById('adviceContent').innerHTML = advice;
}

/**
 * this function creates personalized advice based on the user's answers
 * it looks at what they answered and builds custom recommendations
 * @param {Object} answers - object containing all the user's answers
 * @returns {string} html string with the personalized advice
 */
function generateAdvice(answers) {
    // we start building the html for the advice
    let advice = '<div style="background: white; padding: 28px; border-radius: 16px; margin-bottom: 20px;">';
    advice += '<h3 style="color: var(--dark-blue); margin-bottom: 16px; font-size: 24px;">Your Financial Recommendations</h3>';
    advice += '<ul style="list-style: none; padding: 0;">';

    // we check what their primary goal was (question 0)
    if (answers.question0 === 'emergency') {
        // if they want an emergency fund, we add advice about that
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Priority:</strong> Build an emergency fund of 3-6 months of expenses</li>';
    } else if (answers.question0 === 'retirement') {
        // if they want to save for retirement, we add advice about that
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Priority:</strong> Maximize retirement contributions (401k, IRA)</li>';
    }

    // we check their debt situation (question 3)
    if (answers.question3 === 'high' || answers.question3 === 'some') {
        // if they have any debt, we tell them to pay it off
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Important:</strong> Focus on paying off high-interest debt first</li>';
    }

    // we check their risk tolerance (question 2)
    if (answers.question2 === 'aggressive') {
        // if they can handle risk, we suggest growth stocks
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Investment Style:</strong> Consider growth-focused stock portfolios</li>';
    } else if (answers.question2 === 'conservative') {
        // if they want safety, we suggest bonds and stable stocks
        advice += '<li style="padding: 12px 0; color: var(--navy-blue); line-height: 1.7;">• <strong>Investment Style:</strong> Focus on bonds and stable dividend stocks</li>';
    }

    // we close the list and the container
    advice += '</ul></div>';
    
    // we return the complete html string
    return advice;
}

/**
 * this function restarts the questionnaire from the beginning
 * it resets everything and shows the first question again
 */
function restartQuestionnaire() {
    // we hide the results section
    document.getElementById('resultsSection').classList.add('hidden');
    
    // we show the question card again
    document.getElementById('questionCard').classList.remove('hidden');
    
    // we show the navigation buttons again
    document.querySelector('#questionnaireSection .flex').classList.remove('hidden');
    
    // we reset all the variables to their starting values
    currentQuestion = 0;
    answers = {};
    selectedAnswer = null;
    
    // we display the first question
    displayQuestion();
}

// ========================================
// navigation functions
// ========================================

/**
 * this function takes the user back to the main menu
 * it hides both the flowchart and questionnaire sections
 */
function backToOptions() {
    // we hide the flowchart section
    document.getElementById('flowchartSection').style.display = 'none';
    
    // we hide the questionnaire section
    document.getElementById('questionnaireSection').style.display = 'none';
    
    // we show the introduction section again
    document.getElementById('introSection').style.display = 'block';
    
    // we show the options section with the two big buttons (using grid layout)
    document.getElementById('optionsSection').style.display = 'grid';
}

/**
 * this function handles when the user wants to log out
 * it asks for confirmation, then clears their data and sends them to login page
 */
function handleLogout() {
    // we ask the user to confirm they really want to log out
    if (confirm('Are you sure you want to logout?')) {
        // if they confirm, we remove their username from storage
        localStorage.removeItem('userName');
        
        // we also remove the guest flag
        localStorage.removeItem('isGuest');
        
        // we send them to the login page
        window.location.href = 'login.html';
    }
}

// ========================================
// page initialization
// ========================================

/**
 * this code runs automatically when the page finishes loading
 * it loads and displays the user's information in the navigation bar
 */
window.addEventListener('DOMContentLoaded', loadUserInfo);