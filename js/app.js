// Main application script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

// Initialize the application
function initApp() {
    // Check if user is already logged in
    const currentUser = auth.currentUser;
    
    if (currentUser) {
        // User is already logged in, show home section
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('home-section').classList.remove('hidden');
    } else {
        // User is not logged in, show auth section
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('home-section').classList.add('hidden');
    }
    
    // Add animations to elements
    addAnimations();
    
    // Check if the app is running in a module context
    checkModuleContext();
}

// Add animations to various elements
function addAnimations() {
    // Add logo animation
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.classList.add('logo-animation');
    }
    
    // Add staggered animations to form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('fade-in');
    });
    
    // Add pulse animation to buttons
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('pulse');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('pulse');
        });
    });
}

// Check if the app is running in a module context
function checkModuleContext() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const isModule = urlParams.get('module');
    
    if (isModule) {
        // This is a module view, adjust UI accordingly
        document.body.classList.add('module-view');
        
        // Hide header in module view
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'none';
        }
    }
}

// Handle module communication
window.addEventListener('message', (event) => {
    // Verify the origin for security
    // In production, you should restrict this to your domain
    
    const message = event.data;
    
    if (message.type === 'MODULE_DATA') {
        // Handle data from a module
        console.log('Received data from module:', message.data);
        
        // Process module data
        processModuleData(message.data);
    }
});

// Process data received from a module
function processModuleData(data) {
    // This function would handle any data or events from modules
    // For example, updating scores, saving game state, etc.
    
    // In a real app, you might save this to Firebase
    if (data.score) {
        saveScore(data.score);
    }
    
    if (data.gameState) {
        saveGameState(data.gameState);
    }
}

// Save a score to Firebase (example)
function saveScore(score) {
    const user = auth.currentUser;
    
    if (user) {
        db.collection('scores').add({
            userId: user.uid,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log('Score saved successfully');
        })
        .catch((error) => {
            console.error('Error saving score:', error);
        });
    }
}

// Save game state to Firebase (example)
function saveGameState(gameState) {
    const user = auth.currentUser;
    
    if (user) {
        db.collection('gameStates').doc(user.uid).set({
            state: gameState,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
        .then(() => {
            console.log('Game state saved successfully');
        })
        .catch((error) => {
            console.error('Error saving game state:', error);
        });
    }
}

// Function to send data to a module
function sendDataToModule(moduleWindow, data) {
    if (moduleWindow && moduleWindow.postMessage) {
        moduleWindow.postMessage({
            type: 'PARENT_DATA',
            data: data
        }, '*');
    }
}

// Function to create a module container
function createModuleContainer(modulePath) {
    // Create a container for the module
    const container = document.createElement('div');
    container.className = 'module-container';
    
    // Create an iframe for the module
    const iframe = document.createElement('iframe');
    iframe.src = modulePath;
    iframe.className = 'module-iframe';
    
    // Add the iframe to the container
    container.appendChild(iframe);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'module-close-btn';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        container.remove();
    });
    
    container.appendChild(closeButton);
    
    // Add the container to the body
    document.body.appendChild(container);
    
    return {
        container,
        iframe
    };
}

// Add module container styles
const moduleStyles = document.createElement('style');
moduleStyles.textContent = `
    .module-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .module-iframe {
        width: 90%;
        height: 90%;
        border: none;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }
    
    .module-close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: white;
        color: black;
        font-size: 24px;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .module-close-btn:hover {
        background-color: #f1f1f1;
    }
    
    .module-view {
        background-color: transparent;
    }
`;
document.head.appendChild(moduleStyles);
