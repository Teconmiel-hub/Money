
//JAVASCRIPT FUN
// this is where all the javascript logic is

// the backend server url where concept data is stored
const API_URL = 'http://localhost:5000/api/concepts';



// global variables to track app state
let allConcepts = []; // stores all financial concepts from the database
let quizQuestions = []; // stores the 5 random questions for the current quiz
let currentQuestionIndex = 0; // tracks which question the user is currently on
let score = 0; // tracks how many questions the user answered correctly
let selectedAnswer = null; // stores the answer the user clicked on





// defines the structure of concept categories with icons, subtitles, and display order
const CATEGORY_STRUCTURE = {
    'Money Fundamentals': {
        icon: '💡', // emoji shown next to category name
        subtitle: 'The foundation of financial success', // description under category header
        order: 1 // determines where this category appears on the page
    },
    'Credit & Debt': {
        icon: '💳',
        subtitle: 'Managing credit wisely and eliminating debt',
        order: 2
    },
    'Banking & Accounts': {
        icon: '🏦',
        subtitle: 'Optimizing where your money lives',
        order: 3
    },
    'Investing Basics': {
        icon: '📈',
        subtitle: 'Growing your wealth through smart investments',
        order: 4
    },
    'Retirement Planning': {
        icon: '🎯',
        subtitle: 'Building long-term financial security',
        order: 5
    },
    'Advanced Concepts': {
        icon: '🎓',
        subtitle: 'Next-level wealth building strategies',
        order: 6
    }
};



// main initialization function that runs when the page loads
async function init() {
    loadUserInfo(); // gets user name from local storage and displays it
    await loadConcepts(); // fetches all concepts from the backend database
    createAlphabetWheel(); // generates the A-Z filter buttons
}

// pulls user info from browser's local storage and displays it in the navbar
function loadUserInfo() {
    const userName = localStorage.getItem('userName') || 'Guest'; // gets stored name or defaults to 'Guest'
    const isGuest = localStorage.getItem('isGuest') === 'true'; // checks if user is browsing as guest
    
    // displays the username in the navbar
    document.getElementById('userName').textContent = userName;
    
    const avatar = document.getElementById('userAvatar');
    if (isGuest) {
        avatar.textContent = 'G'; // shows 'G' for guest users
    } else {
        // shows first two letters of username as initials
        const initials = userName.substring(0, 2).toUpperCase();
        avatar.textContent = initials;
    }
}


//ADDED TRY CATCH
// fetches all financial concepts from the backend server
async function loadConcepts() {
    try {
        // makes a GET request to the backend api
        const response = await fetch(API_URL);
        const data = await response.json(); // converts response to javascript object
        
        allConcepts = data; // stores concepts in global variable
        displayConcepts(allConcepts); // renders concepts on the page
    } catch (error) {
        // if fetching fails (server down, network issue, etc), show error message
        console.error('Error loading concepts:', error);
        document.getElementById('conceptsContainer').innerHTML = `
            <div class="alert alert-error">
                <strong>Error loading concepts.</strong><br>
                Make sure your backend server is running on port 5000.<br>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 16px;">
                    Retry
                </button>
            </div>
        `;
    }
}



// takes the concepts array and displays them organized by category
function displayConcepts(concepts) {
    // groups concepts into categories using reduce. creates an object where keys are category names
    const grouped = concepts.reduce((acc, concept) => {
        const cat = concept.category || 'Money Fundamentals'; // defaults to fundamentals if no category
        if (!acc[cat]) acc[cat] = []; // creates empty array if category doesn't exist yet
        acc[cat].push(concept); // adds concept to its category
        return acc;
    }, {});

    let html = ''; // will build up the html string to inject into the page

    // sorts categories by their defined order number
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
        const orderA = CATEGORY_STRUCTURE[a]?.order || 999; // uses 999 for undefined categories
        const orderB = CATEGORY_STRUCTURE[b]?.order || 999;
        return orderA - orderB;
    });



    // loops through each category and generates html
    sortedCategories.forEach(category => {
        // gets the icon and subtitle for this category from the structure object
        const config = CATEGORY_STRUCTURE[category] || { 
            icon: '📚', 
            subtitle: '',
            order: 999 
        };
        const conceptsList = grouped[category]; // gets all concepts in this category

        // builds html for this category section
        html += `
            <div class="category-section">
                <div class="category-header">
                    <div class="category-icon">${config.icon}</div>
                    <h2 class="category-title">${category}</h2>
                    <span class="category-count">${conceptsList.length}</span>
                </div>
                ${config.subtitle ? `<span class="category-subtitle">${config.subtitle}</span>` : ''}
                <div class="concepts-grid">
                    ${conceptsList.map(concept => `
                        <div class="concept-item" data-title="${concept.title.toLowerCase()}" data-description="${concept.description.toLowerCase()}">
                            <h3 class="concept-title">${concept.title}</h3>
                            <p class="concept-description">${concept.description}</p>
                            <span class="concept-category">${category}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    // injects all the generated html into the container
    document.getElementById('conceptsContainer').innerHTML = html;
    
    // updates which letters in the alphabet wheel should be enabled/disabled
    if (document.getElementById('alphabetWheel').children.length > 0) {
        updateLetterAvailability();
    }
}

// searches through concepts as user types in the search box
function searchConcepts() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim(); // gets search text in lowercase
    const conceptItems = document.querySelectorAll('.concept-item'); // finds all concept cards on page

    // if user is searching, clear any active letter filter
    if (query) {
        document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
    }

    // loops through each concept card and shows/hides based on search match
    conceptItems.forEach(item => {
        const title = item.getAttribute('data-title'); // gets lowercase title from data attribute
        const description = item.getAttribute('data-description'); // gets lowercase description
        
        // checks if search query appears in title or description
        if (title.includes(query) || description.includes(query)) {
            item.style.display = 'block'; // shows matching concepts
        } else {
            item.style.display = 'none'; // hides non-matching concepts
        }
    });
}

// generates the A-Z filter buttons
function createAlphabetWheel() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // splits string into array of letters
    const wheelContainer = document.getElementById('alphabetWheel');
    
    // creates the "All" button to clear filters
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-filter-btn';
    clearBtn.textContent = 'All';
    clearBtn.onclick = clearLetterFilter; // clicking calls the clear function
    wheelContainer.appendChild(clearBtn);
    
    // creates a button for each letter
    alphabet.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.onclick = () => filterByLetter(letter); // clicking filters by that letter
        btn.dataset.letter = letter; // stores letter in data attribute for later reference
        wheelContainer.appendChild(btn);
    });

    updateLetterAvailability(); // disables letters that have no concepts
}

// filters concepts to only show ones starting with the clicked letter
function filterByLetter(letter) {
    // clears the search input since we're using letter filter instead
    document.getElementById('searchInput').value = '';
    
    // updates which letter button looks active
    document.querySelectorAll('.letter-btn').forEach(btn => {
        if (btn.dataset.letter === letter) {
            btn.classList.add('active'); // highlights the clicked letter
        } else {
            btn.classList.remove('active'); // unhighlights other letters
        }
    });

    // shows/hides concept cards based on first letter
    const conceptItems = document.querySelectorAll('.concept-item');
    conceptItems.forEach(item => {
        const title = item.getAttribute('data-title');
        if (title.startsWith(letter.toLowerCase())) {
            item.style.display = 'block'; // shows concepts starting with this letter
        } else {
            item.style.display = 'none'; // hides other concepts
        }
    });
}

// removes letter filter and shows all concepts again
function clearLetterFilter() {
    // clears search input
    document.getElementById('searchInput').value = '';
    
    // removes active state from all letter buttons
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // makes all concept cards visible again
    const conceptItems = document.querySelectorAll('.concept-item');
    conceptItems.forEach(item => {
        item.style.display = 'block';
    });
}

// figures out which letters have concepts and enables/disables buttons accordingly
function updateLetterAvailability() {
    const conceptItems = document.querySelectorAll('.concept-item');
    const availableLetters = new Set(); // set automatically removes duplicates

    // loops through concepts to see which letters they start with
    conceptItems.forEach(item => {
        const title = item.getAttribute('data-title');
        if (title && title.length > 0) {
            availableLetters.add(title[0].toUpperCase()); // adds first letter to set
        }
    });

    // updates button states based on which letters have concepts
    document.querySelectorAll('.letter-btn').forEach(btn => {
        const letter = btn.dataset.letter;
        if (availableLetters.has(letter)) {
            btn.classList.remove('disabled'); // enables letters that have concepts
        } else {
            btn.classList.add('disabled'); // disables letters with no concepts
        }
    });
}

// starts a new quiz when user clicks the test knowledge button
async function startQuiz() {
    // makes sure concepts have loaded before starting quiz
    if (allConcepts.length === 0) {
        alert('Please wait for concepts to load first!');
        return;
    }

    // creates 5 random quiz questions from the concepts
    generateQuizQuestions();
    
    // resets quiz state variables to starting values
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    
    // shows the quiz modal and first question
    document.getElementById('quizModal').classList.add('active');
    document.getElementById('quizResult').classList.remove('active');
    document.getElementById('quizNav').style.display = 'flex';
    
    displayQuestion(); // renders the first question
}

// generates 5 random multiple choice questions from the concepts
function generateQuizQuestions() {
    // randomly shuffles the concepts array
    const shuffled = [...allConcepts].sort(() => 0.5 - Math.random());
    // takes first 5 concepts (or less if fewer than 5 exist)
    const selected = shuffled.slice(0, Math.min(5, shuffled.length));

    // creates a question object for each selected concept
    quizQuestions = selected.map(concept => {
        // defines different question formats
        const questionTypes = [
            {
                question: `What is ${concept.title}?`,
                correct: concept.description,
                type: 'definition'
            },
            {
                question: `Which statement best describes ${concept.title}?`,
                correct: concept.description,
                type: 'description'
            }
        ];

        // randomly picks one of the question formats
        const chosen = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        // gets 3 wrong answers from other concepts
        const wrongAnswers = allConcepts
            .filter(c => c._id !== concept._id) // excludes the current concept
            .sort(() => 0.5 - Math.random()) // shuffles
            .slice(0, 3) // takes first 3
            .map(c => c.description); // gets just the descriptions

        // combines correct answer with wrong answers and shuffles them
        const allAnswers = [chosen.correct, ...wrongAnswers]
            .sort(() => 0.5 - Math.random());

        // returns question object with all necessary info
        return {
            question: chosen.question,
            answers: allAnswers,
            correct: chosen.correct,
            concept: concept.title
        };
    });

    // updates the total questions counter in the quiz header
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
}

// displays the current question on screen
function displayQuestion() {
    // if we've gone through all questions, show results instead
    if (currentQuestionIndex >= quizQuestions.length) {
        showResults();
        return;
    }

    const question = quizQuestions[currentQuestionIndex]; // gets current question object
    
    // updates progress indicators in header
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('currentScore').textContent = score;

    // builds html for the question and answer choices
    const html = `
        <div class="quiz-question active">
            <div class="question-text">${question.question}</div>
            <div class="quiz-options">
                ${question.answers.map((answer, index) => `
                    <div class="quiz-option" onclick="selectAnswer(${index}, '${answer.replace(/'/g, "\\'")}')">
                        ${answer}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // injects question html into the quiz body
    document.getElementById('quizQuestions').innerHTML = html;
    document.getElementById('nextBtn').style.display = 'none'; // hides next button until they answer
    selectedAnswer = null; // resets selected answer
}

// handles when user clicks on an answer choice
function selectAnswer(index, answer) {
    if (selectedAnswer !== null) return; // prevents clicking multiple answers

    selectedAnswer = answer; // stores which answer they picked
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');

    // loops through all answer options to show correct/incorrect
    options.forEach((option, i) => {
        option.style.pointerEvents = 'none'; // disables further clicking
        
        // highlights the correct answer in green
        if (option.textContent.trim() === question.correct.trim()) {
            option.classList.add('correct');
        } else if (i === index) {
            // if they clicked wrong answer, highlight it in red
            option.classList.add('incorrect');
        }
    });

    // if they got it right, increment the score
    if (answer === question.correct) {
        score++;
        document.getElementById('currentScore').textContent = score;
    }

    // shows the next button so they can move to next question
    document.getElementById('nextBtn').style.display = 'block';
}

// moves to the next question when user clicks next button
function nextQuestion() {
    currentQuestionIndex++; // increments question counter
    displayQuestion(); // shows the next question
}

// displays the final results screen after completing all questions
function showResults() {
    // hides navigation buttons
    document.getElementById('quizNav').style.display = 'none';
    // shows results section
    document.getElementById('quizResult').classList.add('active');

    const total = quizQuestions.length; // total number of questions
    const percentage = Math.round((score / total) * 100); // calculates percentage score

    // updates score displays
    document.getElementById('finalScore').textContent = `${score}/${total}`;
    document.getElementById('correctAnswers').textContent = score;
    document.getElementById('incorrectAnswers').textContent = total - score;
    document.getElementById('percentageScore').textContent = `${percentage}%`;

    // determines encouraging message based on performance
    let message = '';
    if (percentage >= 80) {
        message = '🎉 Excellent! You\'re a financial literacy expert!';
    } else if (percentage >= 60) {
        message = '👍 Great job! You have a solid understanding!';
    } else if (percentage >= 40) {
        message = '📚 Good effort! Review the concepts and try again!';
    } else {
        message = '💪 Keep learning! Practice makes perfect!';
    }

    // displays the personalized message
    document.getElementById('resultMessage').textContent = message;
}

// resets quiz and starts over when user clicks try again
function restartQuiz() {
    document.getElementById('quizResult').classList.remove('active'); // hides results
    startQuiz(); // starts a fresh quiz
}

// closes the quiz modal and returns to main page
function closeQuiz() {
    document.getElementById('quizModal').classList.remove('active');
}

// handles when user clicks logout button
function handleLogout() {
    // asks for confirmation before logging out
    if (confirm('Are you sure you want to logout?')) {
        // removes user data from local storage
        localStorage.removeItem('userName');
        localStorage.removeItem('isGuest');
        // redirects back to login page
        window.location.href = 'login.html';
    }
}

// runs the init function as soon as the page finishes loading
window.addEventListener('DOMContentLoaded', init);