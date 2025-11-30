// index.js - homepage-specific functionality

/**
 * makes module cards clickable and keyboard accessible
 */
function setupModuleCards() {
    // find all module cards on the page
    const cards = document.querySelectorAll('.module-card');
    
    // add event handlers to each card
    cards.forEach(card => {
        // handle mouse clicks
        card.addEventListener('click', function() {
            const route = this.getAttribute('data-route');
            window.location.href = route + '.html';
        });
        
        // handle keyboard navigation (enter or space key)
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // prevent page scroll on space
                const route = this.getAttribute('data-route');
                window.location.href = route + '.html';
            }
        });
    });
}

/**
 * handles image loading errors with emoji fallback
 */
function setupImageFallbacks() {
    // find all module images
    const images = document.querySelectorAll('.module-img');
    
    images.forEach(img => {
        // if image fails to load
        img.addEventListener('error', function() {
            // hide the broken image
            this.style.display = 'none';
            
            // show the emoji fallback
            const fallback = this.parentElement.querySelector('.module-icon-text');
            if (fallback) {
                fallback.style.display = 'flex';
            }
        });
    });
}

/**
 * initializes homepage functionality when page loads
 */
function initHomepage() {
    setupModuleCards();
    setupImageFallbacks();
}

// run when page is ready
document.addEventListener('DOMContentLoaded', initHomepage);