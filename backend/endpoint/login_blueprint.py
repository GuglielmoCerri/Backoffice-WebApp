import os
import sys; sys.path.insert(1, os.path.join(sys.path[0], '..'))
import jwt
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from db_schema import db, User
from dotenv import load_dotenv


login_blueprint = Blueprint('login_blueprint', __name__)
load_dotenv()

# --------------------- AUTHENTICATION ENDPOINT ---------------------------

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@login_blueprint.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', '')
    password = request.json.get('password', '')
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=username, fresh=True, expires_delta=timedelta(minutes=30))
        refresh_token = create_refresh_token(identity=username)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    
    return jsonify({"message": "Invalid credentials"}), 401

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@login_blueprint.route('/register', methods=['POST'])
def register():
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

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@login_blueprint.route('/verify-token', methods=['POST'])
def verify_token():
    token = request.get_json().get('token')
    try:
        jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        return jsonify({'valid': True})
    except jwt.ExpiredSignatureError:
        return jsonify({'valid': False, 'error': 'Token expired'})
    except jwt.InvalidTokenError:
        return jsonify({'valid': False, 'error': 'Invalid token'})

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@login_blueprint.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user, fresh=False, expires_delta=timedelta(minutes=30))
    return jsonify(access_token=access_token), 200