// login.js - separate javascript file

// constants for easy maintenance
const HOME_PAGE = 'index.html';
const MIN_PASSWORD_LENGTH = 6;

// wait for DOM to be fully loaded before running code
document.addEventListener('DOMContentLoaded', function() {
    // get references to dom elements once DOM is ready
    const loginForm = document.getElementById('loginForm');
    const guestBtn = document.getElementById('guestBtn');
    const errorMessage = document.getElementById('errorMessage');

    // attach event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (guestBtn) {
        guestBtn.addEventListener('click', continueAsGuest);
    }

    /**
     * handles user login submission
     * validates input and stores user data
     */
    function handleLogin(event) {
        event.preventDefault();
        
        // get and clean input values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // validate inputs
        if (!validateEmail(email)) {
            showError('please enter a valid email address');
            return;
        }
        
        if (password.length < MIN_PASSWORD_LENGTH) {
            showError(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }
        
        // in real app, this would be an api call
        // for now, just store locally
        try {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', extractUsername(email));
            
            // redirect to home
            window.location.href = HOME_PAGE;
        } catch (error) {
            console.error('login error:', error);
            showError('something went wrong. please try again');
        }
    }

    /**
     * allows user to continue without logging in
     */
    function continueAsGuest() {
        console.log('Guest button clicked!'); // debug log
        
        try {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('isGuest', 'true');
            localStorage.setItem('userName', 'Guest');
            
            console.log('Redirecting to:', HOME_PAGE); // debug log
            window.location.href = HOME_PAGE;
        } catch (error) {
            console.error('guest login error:', error);
            showError('something went wrong. please try again');
        }
    }

    /**
     * validates email format
     * @param {string} email - email to validate
     * @returns {boolean} true if valid
     */
    function validateEmail(email) {
        // basic email regex pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    /**
     * extracts username from email
     * @param {string} email - email address
     * @returns {string} username portion
     */
    function extractUsername(email) {
        return email.split('@')[0];
    }

    /**
     * displays error message to user
     * @param {string} message - error message to show
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        
        // auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
});