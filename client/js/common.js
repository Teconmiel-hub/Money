// common.js - shared functionality across all pages

/**
 * loads user information from localstorage and updates navigation bar
 */
function loadUserInfo() {
    // get stored user data
    const userName = localStorage.getItem('userName') || 'Guest';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    // update the username text in navigation
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
    
    // update the avatar circle with initials
    const avatarElement = document.getElementById('userAvatar');
    if (avatarElement) {
        if (isGuest) {
            avatarElement.textContent = 'G';
        } else {
            // take first 2 letters of name
            const initials = userName.substring(0, 2).toUpperCase();
            avatarElement.textContent = initials;
        }
    }
}

/**
 * handles logout button click
 */
function handleLogout() {
    // ask user to confirm
    if (confirm('Are you sure you want to logout?')) {
        // clear all stored user data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isGuest');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // redirect back to login page
        window.location.href = 'login.html';
    }
}

/**
 * sets up logout button click handler
 */
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * initializes common functionality when page loads
 */
function initCommon() {
    loadUserInfo();
    setupLogoutButton();
}

// automatically run when page loads
document.addEventListener('DOMContentLoaded', initCommon);