from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from flask_cors import CORS

app = Flask(__name__)

# Point the database to the correct path
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = r"C:\Users\adamv\OneDrive\CSE120\FirstMobileApp\TomatoApp\init_database.sqlite3"
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this!

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Initialize Database
with app.app_context():
    db.create_all()

# Register Route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully!"}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"🟢 Login attempt for: {data['username']}")

    user = User.query.filter_by(username=data['username']).first()

    if not user:
        print("❌ User not found!")
        return jsonify({"error": "Invalid username or password"}), 401

    if not bcrypt.check_password_hash(user.password, data['password']):
        print(f"❌ Password mismatch for {data['username']}")
        print(f"Stored Hash: {user.password}")
        return jsonify({"error": "Invalid username or password"}), 401

    print("✅ Login successful!")
    access_token = create_access_token(identity=user.username)
    return jsonify(access_token=access_token), 200

# Test Route
@app.route('/')
def home():
    return "Flask backend is running!"

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
