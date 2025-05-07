// DOM Elements
const gamesGrid = document.getElementById('games-grid');

// Sample game data (in a real app, this would come from Firebase)
const sampleGames = [
    {
        id: 'game1',
        title: 'Juego de Muestra',
        description: 'Un juego simple para demostrar la estructura modular',
        imageUrl: 'https://via.placeholder.com/300x180/5c6bc0/FFFFFF?text=Juego+de+Muestra',
        modulePath: 'modules/sample-game/index.html'
    },
    {
        id: 'game2',
        title: 'Juego 2',
        description: 'Próximamente disponible',
        imageUrl: null,
        modulePath: 'modules/game2/index.html'
    },
    {
        id: 'game3',
        title: 'Juego 3',
        description: 'Próximamente disponible',
        imageUrl: null,
        modulePath: 'modules/game3/index.html'
    },
    {
        id: 'game4',
        title: 'Juego 4',
        description: 'Próximamente disponible',
        imageUrl: null,
        modulePath: 'modules/game4/index.html'
    },
    {
        id: 'game5',
        title: 'Juego 5',
        description: 'Próximamente disponible',
        imageUrl: null,
        modulePath: 'modules/game5/index.html'
    },
    {
        id: 'game6',
        title: 'Juego 6',
        description: 'Próximamente disponible',
        imageUrl: null,
        modulePath: 'modules/game6/index.html'
    }
];

// Function to load games from Firebase (in a real app)
function loadGamesFromFirebase() {
    db.collection('games').get()
        .then((querySnapshot) => {
            const games = [];
            querySnapshot.forEach((doc) => {
                games.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            renderGames(games);
        })
        .catch((error) => {
            console.error('Error loading games:', error);
            // Fallback to sample games if Firebase fails
            renderGames(sampleGames);
        });
}

// Function to render games in the grid
function renderGames(games) {
    // Clear existing games
    gamesGrid.innerHTML = '';
    
    // Add games with animation delay for staggered effect
    games.forEach((game, index) => {
        const gameCard = createGameCard(game, index);
        gamesGrid.appendChild(gameCard);
    });
}

// Function to create a game card element
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in');
    
    // Create placeholder image if no image URL is provided
    const imageUrl = game.imageUrl || createPlaceholderImage(game.title);
    
    card.innerHTML = `
        <div class="game-image-container">
            <img src="${imageUrl}" alt="${game.title}" class="game-image">
            <div class="game-overlay">
                <span class="play-icon">▶</span>
            </div>
        </div>
        <div class="game-info">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-description">${game.description}</p>
        </div>
    `;
    
    // Add click event to open the game
    card.addEventListener('click', () => {
        openGame(game);
    });
    
    return card;
}

// Function to create a placeholder image with the game title
function createPlaceholderImage(title) {
    // Use a neutral color palette for placeholders
    const colors = ['#5c6bc0', '#757575', '#4a4a4a', '#9e9e9e'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `https://via.placeholder.com/300x180/${randomColor.replace('#', '')}/FFFFFF?text=${encodeURIComponent(title)}`;
}

// Function to open a game
function openGame(game) {
    // Show loading animation
    showGameLoading();
    
    // In a real app, you might load the game in an iframe or redirect to the game page
    setTimeout(() => {
        // For sample game, open the sample game
        if (game.id === 'game1') {
            window.location.href = 'modules/sample-game/index.html';
        } else {
            // For other games, show "coming soon" message
            hideGameLoading();
            showNotification('Este juego estará disponible próximamente', 'info');
        }
    }, 800);
}

// Function to show game loading animation
function showGameLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay scale-in';
    loadingOverlay.id = 'loading-overlay';
    
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading"></div>
            <p>Cargando juego...</p>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
}

// Function to hide game loading animation
function hideGameLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }
}

// Function to show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after animation completes
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 600);
    }, 3400);
}

// Add loading overlay and game card styles
const gameStyles = document.createElement('style');
gameStyles.textContent = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(51, 51, 51, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        color: white;
    }
    
    .loading-overlay.fade-out {
        opacity: 0;
        transition: opacity 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    
    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateY(0);
        transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    
    .loading-overlay .loading {
        width: 40px;
        height: 40px;
        border-width: 3px;
        margin-bottom: 20px;
    }
    
    .game-image-container {
        overflow: hidden;
        height: 180px;
        position: relative;
    }
    
    .game-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    
    .game-card:hover .game-overlay {
        opacity: 1;
    }
    
    .play-icon {
        color: white;
        font-size: 2.5rem;
        background-color: rgba(92, 107, 192, 0.8);
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(0.8);
        transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    
    .game-card:hover .play-icon {
        transform: scale(1);
    }
`;
document.head.appendChild(gameStyles);

// Initialize games when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Try to load games from Firebase, fallback to sample games
    try {
        loadGamesFromFirebase();
    } catch (error) {
        console.error('Error initializing games:', error);
        renderGames(sampleGames);
    }
});

// Function to add a new game module (for future use)
function addGameModule(gameData) {
    // Add game to Firebase
    return db.collection('games').add(gameData)
        .then((docRef) => {
            console.log('Game added with ID:', docRef.id);
            // Refresh games list
            loadGamesFromFirebase();
            return docRef.id;
        })
        .catch((error) => {
            console.error('Error adding game:', error);
            throw error;
        });
}
