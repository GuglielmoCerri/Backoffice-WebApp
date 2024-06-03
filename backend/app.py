import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

db = SQLAlchemy(app)
CORS(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

@app.route('/register', methods=['POST'])
def register():
    print('asd')
    username = request.json.get('username', '')
    password = request.json.get('password', '')

    if not username or not password:
        return jsonify({"message": "Username and password are both required"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user", "error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', '')
    password = request.json.get('password', '')
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)
