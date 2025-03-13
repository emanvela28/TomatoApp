from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Point the database to the correct path
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = r"C:\Users\adamv\OneDrive\CSE120\FirstMobileApp\TomatoApp\init_database.sqlite3"
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

# Truck Model
class Truck(db.Model):
    truck_id = db.Column(db.Integer, primary_key=True)
    license_plate = db.Column(db.String(20), unique=True, nullable=False)
    arrival_time = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    departure_time = db.Column(db.String(20), nullable=True)

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
    user = User.query.filter_by(username=data['username']).first()

    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=user.username)
    return jsonify(access_token=access_token), 200

# API Route to Fetch Truck Data
@app.route('/api/trucks', methods=['GET'])
def get_trucks():
    trucks = Truck.query.all()  # Fetch all trucks from database
    truck_list = [
        {
            "truck_id": truck.truck_id,
            "license_plate": truck.license_plate,
            "arrival_time": truck.arrival_time,
            "status": truck.status,
            "departure_time": truck.departure_time
        }
        for truck in trucks
    ]
    return jsonify(truck_list), 200

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
