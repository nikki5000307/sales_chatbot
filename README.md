<<<<<<< HEAD
# sales_chatbot
=======
# E-commerce Sales Chatbot

[cite_start]This project is a comprehensive e-commerce sales chatbot designed to enhance the online shopping experience.  [cite_start]It features a frontend interface built with HTML/CSS/JS and a Python-based backend using the Flask framework. 

## Project Summary

[cite_start]The chatbot facilitates customer interactions from product search to exploration.  [cite_start]Users can register, log in to a secure session, and interact with the bot to find products from a mock e-commerce inventory.  [cite_start]The system is composed of a responsive client-side application and a RESTful backend server that handles all business logic. 

## Technology Stack

* **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Cors
* [cite_start]**Database:** SQLite (a lightweight RDBMS) 
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Package Management:** pip (for Python)

### [cite_start]Rationale for Choices 

* **Flask:** Chosen for its simplicity and minimalistic core, making it ideal for creating a lightweight, API-driven backend. Its flexibility allows for easy integration of extensions like SQLAlchemy and JWT.
* [cite_start]**SQLite:** Selected as the RDBMS for its serverless, self-contained nature, which simplifies setup and is perfectly adequate for handling the mock inventory. 
* **Vanilla JavaScript:** Used on the frontend to demonstrate core web development principles without the overhead of a large framework, while still being powerful enough to create a responsive, single-page-like experience.

## Project Setup and Execution

### Prerequisites

* Python 3.8+
* pip
* A web browser

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a Python virtual environment:
    ```bash
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```
3.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt 
    # (Note: You would first create this file using 'pip freeze > requirements.txt')
    ```
4.  Initialize the database (run this only once):
    ```bash
    flask init-db
    ```
5.  Start the backend server:
    ```bash
    python app.py
    ```
    The server will run on `http://127.0.0.1:5000`.

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Open the `login.html` file in your web browser. No server or build step is required for this simple frontend.

## API Endpoints

* `POST /register`: Creates a new user.
    * Payload: `{ "username": "user", "password": "pw" }`
* [cite_start]`POST /login`: Authenticates a user and returns a JWT. 
    * Payload: `{ "username": "user", "password": "pw" }`
* `POST /chat`: (Protected) Processes chatbot messages.
    * Headers: `{ "Authorization": "Bearer <token>" }`
    * Payload: `{ "message": "search for electronics" }`
    * Response: `{ "reply": "...", "products": [...] }`

## Potential Challenges

One potential challenge was designing the chatbot's query processing logic on the backend without a full NLP library. This was handled by implementing a simple but effective keyword-based search (`"search for"`, `"find"`). This approach is fault-tolerant for simple queries and demonstrates the core functionality, while the system remains modular enough to integrate a more advanced NLP engine in the future.
>>>>>>> 3e9c318 (first commit)
