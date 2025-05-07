// DOM Elements
const authSection = document.getElementById('auth-section');
const homeSection = document.getElementById('home-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');
const logoutBtn = document.getElementById('logout-btn');
const userNameDisplay = document.getElementById('user-name');

// Form references
const loginFormElement = document.getElementById('login');
const registerFormElement = document.getElementById('register');

// Toggle between login and register forms
showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});

showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

// Handle login form submission
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Show loading state
    const submitBtn = loginFormElement.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Iniciando sesión...';
    submitBtn.disabled = true;
    
    // Sign in with Firebase
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Clear form
            loginFormElement.reset();
            
            // Show success notification
            showNotification('¡Inicio de sesión exitoso!', 'success');
        })
        .catch((error) => {
            console.error("Login error:", error);
            
            // Translate common Firebase errors to user-friendly messages
            let errorMessage = getErrorMessage(error.code);
            
            // Show error notification
            showNotification(errorMessage, 'error');
            
            // Reset button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
});

// Handle register form submission
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Show loading state
    const submitBtn = registerFormElement.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Registrando...';
    submitBtn.disabled = true;
    
    // Create user with Firebase
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User created successfully:", userCredential.user.uid);
            
            // Add user profile to Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            console.log("User profile created in Firestore");
            
            // Update user profile
            return auth.currentUser.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            console.log("User display name updated");
            
            // Clear form
            registerFormElement.reset();
            
            // Show success notification
            showNotification('¡Registro exitoso!', 'success');
        })
        .catch((error) => {
            console.error("Registration error:", error);
            
            // Translate common Firebase errors to user-friendly messages
            let errorMessage = getErrorMessage(error.code);
            
            // Show error notification
            showNotification(errorMessage, 'error');
            
            // Reset button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
});

// Translate Firebase error codes to user-friendly messages
function getErrorMessage(errorCode) {
    switch(errorCode) {
        case 'auth/email-already-in-use':
            return 'Este correo electrónico ya está en uso. Intenta iniciar sesión.';
        case 'auth/invalid-email':
            return 'El correo electrónico no es válido.';
        case 'auth/weak-password':
            return 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
        case 'auth/user-not-found':
            return 'No existe una cuenta con este correo electrónico.';
        case 'auth/wrong-password':
            return 'Contraseña incorrecta.';
        case 'auth/configuration-not-found':
            return 'Error de configuración de Firebase. Por favor, verifica que la autenticación esté habilitada en la consola de Firebase.';
        case 'auth/network-request-failed':
            return 'Error de conexión. Verifica tu conexión a internet.';
        default:
            return `Error: ${errorCode}`;
    }
}

// Handle logout
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            showNotification('Has cerrado sesión correctamente', 'info');
        })
        .catch((error) => {
            console.error("Logout error:", error);
            showNotification(`Error al cerrar sesión: ${error.message}`, 'error');
        });
});

// Auth state observer
auth.onAuthStateChanged((user) => {
    console.log("Auth state changed:", user ? "User logged in" : "User logged out");
    
    if (user) {
        // User is signed in
        userNameDisplay.textContent = user.displayName || 'Usuario';
        
        // Switch to home section with animation
        authSection.classList.add('hidden');
        homeSection.classList.remove('hidden');
        
        // Load user data and games
        loadUserData(user.uid);
    } else {
        // User is signed out
        homeSection.classList.add('hidden');
        authSection.classList.remove('hidden');
    }
});

// Load user data from Firestore
function loadUserData(userId) {
    db.collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                userNameDisplay.textContent = userData.name;
            }
        })
        .catch((error) => {
            console.error('Error loading user data:', error);
        });
}

// Notification system
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

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .notification.fade-out {
        opacity: 0;
        transition: opacity 0.4s ease;
    }
    
    .notification-success {
        background-color: #4caf50;
    }
    
    .notification-error {
        background-color: #f44336;
    }
    
    .notification-info {
        background-color: #5c6bc0;
    }
`;
document.head.appendChild(notificationStyles);

// Add input focus event listeners
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.add('input-focus');
        });
    });
});
