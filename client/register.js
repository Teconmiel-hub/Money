// register.js handles user registration

// constants for easy maintenance
const HOME_PAGE = 'index.html';
const LOGIN_PAGE = 'login.html';
const MIN_PASSWORD_LENGTH = 6;

// wait for DOM to be fully loaded before running code
document.addEventListener('DOMContentLoaded', function() {
    // get references to dom elements once DOM is ready
    const registerForm = document.getElementById('registerForm');
    const guestBtn = document.getElementById('guestBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // attach event listeners
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (guestBtn) {
        guestBtn.addEventListener('click', continueAsGuest);
    }

    /**
     * handles user registration submission
     * validates all inputs and creates new account
     */
    function handleRegister(event) {
        event.preventDefault();
        
        // get and clean input values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // hide any previous messages
        hideMessages();
        
        // validate full name
        if (fullName.length < 2) {
            showError('please enter your full name');
            return;
        }
        
        // validate email format
        if (!validateEmail(email)) {
            showError('please enter a valid email address');
            return;
        }
        
        // validate password length
        if (password.length < MIN_PASSWORD_LENGTH) {
            showError(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }
        
        // validate passwords match
        if (password !== confirmPassword) {
            showError('passwords do not match');
            return;
        }
        
        // in real app, this would be an api call to create account
        // for now, just store locally and redirect
        try {
            // store user data
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', fullName);
            localStorage.setItem('userFullName', fullName);
            
            // show success message
            showSuccess('account created successfully! redirecting...');
            
            // redirect to home after short delay
            setTimeout(() => {
                window.location.href = HOME_PAGE;
            }, 1500);
            
        } catch (error) {
            console.error('registration error:', error);
            showError('something went wrong. please try again');
        }
    }

    /**
     * allows user to continue without registering
     */
    function continueAsGuest() {
        try {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('isGuest', 'true');
            localStorage.setItem('userName', 'Guest');
            
            window.location.href = HOME_PAGE;
        } catch (error) {
            console.error('guest access error:', error);
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

    /**
     * displays success message to user
     * @param {string} message - success message to show
     */
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.remove('hidden');
    }

    /**
     * hides all messages
     */
    function hideMessages() {
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
    }
});