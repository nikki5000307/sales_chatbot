import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from models import db, User, Product
from database import init_db, populate_db

# Create the Flask app instance
app = Flask(__name__)

# --- Configuration ---
app.config['SECRET_KEY'] = 'eb99a780e0db7ebef6a3a40ef0247106'
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')
os.makedirs(instance_path, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'ecommerce.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "another-super-secret"
jwt = JWTManager(app)

# Initialize extensions
CORS(app)
db.init_app(app)

# --- Custom CLI Command for Database ---
@app.cli.command("init-db")
def init_db_command():
    """Clear existing data, create new tables, and populate them."""
    init_db()
    populate_db()
    print("Database has been initialized and populated.")

# --- API Routes ---
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 409
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    """Processes user chat messages to search for products."""
    data = request.get_json()
    message = data.get('message', '').lower()
    current_user = get_jwt_identity()

    if any(greeting in message for greeting in ["hello", "hi", "hey"]):
        return jsonify({"reply": f"Hello {current_user}! How can I help you? You can ask me to 'search for electronics' or 'find a book'."})

    products = []
    if "search for" in message or "find" in message:
        query = message.split("search for")[-1].split("find")[-1].strip()
        if query:
            search_term = f"%{query}%"
            products = Product.query.filter(
                Product.name.ilike(search_term) |
                Product.description.ilike(search_term) |
                Product.category.ilike(search_term)
            ).limit(6).all()
            reply_message = f"I found these products matching '{query}':"
        else:
            reply_message = "Please specify what you want to search for."
    else:
        reply_message = "I'm sorry, I didn't understand. Try 'search for t-shirt' or 'find a laptop'."

    if products:
        response = {"reply": reply_message, "products": [p.to_dict() for p in products]}
    else:
        response = {"reply": reply_message, "products": []}

    return jsonify(response)
@app.route('/')
def home():
    return '📚 Sales Chatbot Backend is Running!'


if __name__ == '__main__':
    app.run(debug=True, port=5000)
    