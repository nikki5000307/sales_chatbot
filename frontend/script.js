// --- Constants and Global State ---
const API_URL = 'http://127.0.0.1:5000';
const currentPage = window.location.pathname.split('/').pop();

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (currentPage === 'index.html') {
        // Chat page logic
        checkAuth();
        setupChatPage();
    } else if (currentPage === 'login.html' || currentPage === '') {
        // Login page logic
        setupLoginPage();
    }
});

// --- Authentication --- 
function checkAuth() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function setupLoginPage() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginBtn.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('jwt_token', data.access_token);
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = data.msg || 'Login failed';
            }
        } catch (error) {
            errorMessage.textContent = 'Network error. Please try again.';
        }
    });

    registerBtn.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.status === 201) {
                errorMessage.textContent = 'Registration successful! Please log in.';
                errorMessage.style.color = '#4CAF50';
            } else {
                errorMessage.textContent = data.msg || 'Registration failed';
            }
        } catch (error) {
            errorMessage.textContent = 'Network error. Please try again.';
        }
    });
}

// --- Chat Page Logic ---
function setupChatPage() {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const productDisplay = document.getElementById('product-display');
    const resetBtn = document.getElementById('reset-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Load chat history from localStorage 
    loadChatHistory();

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessageToChat('user', message);
        userInput.value = '';
        productDisplay.innerHTML = ''; // Clear previous products

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message }),
            });

            if (response.status === 401) { // Token expired or invalid
                logout();
                return;
            }

            const data = await response.json();
            addMessageToChat('bot', data.reply);
            
            if (data.products && data.products.length > 0) {
                displayProducts(data.products);
            }
            saveChatHistory();

        } catch (error) {
            addMessageToChat('bot', 'Sorry, I am having trouble connecting. Please try again later.');
            saveChatHistory();
        }
    }

    // Function to handle conversation reset 
    resetBtn.addEventListener('click', () => {
        chatBox.innerHTML = '';
        productDisplay.innerHTML = '';
        localStorage.removeItem('chatHistory');
        addMessageToChat('bot', 'Conversation reset. How can I help you?');
        saveChatHistory();
    });

    logoutBtn.addEventListener('click', logout);
}

function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('chatHistory');
    window.location.href = 'login.html';
}

// --- UI Display Functions ---

// Adds a message to the chat box with a timestamp 
function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.innerHTML = `
        <div>${message}</div>
        <div class="timestamp">${timestamp}</div>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Renders product cards
function displayProducts(products) {
    const productDisplay = document.getElementById('product-display');
    productDisplay.innerHTML = ''; // Clear previous results

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>$${product.price.toFixed(2)}</p>
        `;
        productDisplay.appendChild(card);
    });
}

// --- Session & History Management --- 
function saveChatHistory() {
    const chatBox = document.getElementById('chat-box');
    localStorage.setItem('chatHistory', chatBox.innerHTML);
}

function loadChatHistory() {
    const chatHistory = localStorage.getItem('chatHistory');
    if (chatHistory) {
        document.getElementById('chat-box').innerHTML = chatHistory;
    } else {
        // Initial welcome message
        addMessageToChat('bot', "Welcome! I'm your e-commerce assistant. You can ask me to find products for you.");
        saveChatHistory();
    }
}