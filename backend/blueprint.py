from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

from backend.db_schema import db, User, Customer


my_blueprint = Blueprint('my_blueprint', __name__)

# --------------------- AUTHENTICATION ENDPOINT ---------------------------
@my_blueprint.route('/login', methods=['POST'])
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
@my_blueprint.route('/register', methods=['POST'])
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
@my_blueprint.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@my_blueprint.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user, fresh=False, expires_delta=timedelta(minutes=30))
    return jsonify(access_token=access_token), 200

# --------------------- CUSTOMERS ENDPOINT -----------------------------
def apply_filters_and_pagination(query, request_args, sortable_fields):
    for key, value in request_args.items():
        if key in sortable_fields:
            query = query.filter(getattr(Customer, key).like(f"%{value}%"))

    sort_by = request_args.get('sort_by', None)
    if sort_by in sortable_fields:
        direction = request_args.get('direction', 'asc')
        if direction == 'desc':
            query = query.order_by(getattr(Customer, sort_by).desc())
        else:
            query = query.order_by(getattr(Customer, sort_by).asc())

    page = int(request_args.get('page', 1))
    per_page = int(request_args.get('per_page', 10))
    return query.paginate(page=page, per_page=per_page)

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@my_blueprint.route('/customers', methods=['GET'])
def get_customers():
    query = Customer.query
    customers = apply_filters_and_pagination(query, request.args, ['name', 'email', 'phone', 'location', 'hobbies'])
    return jsonify([customer.as_dict() for customer in customers.items])

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@my_blueprint.route('/customer/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get_or_404(id)
    return jsonify(customer.as_dict())

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@my_blueprint.route('/customer', methods=['POST'])
def add_customer():
    data = request.get_json()
    new_customer = Customer(name=data['name'], email=data['email'], phone=data['phone'], location=data['location'], hobbies=data['hobbies'])
    db.session.add(new_customer)
    db.session.commit()
    return jsonify(new_customer.as_dict()), 201

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@my_blueprint.route('/customer/<int:id>', methods=['PUT'])
def update_customer(id):
    data = request.get_json()
    customer = Customer.query.get_or_404(id)
    customer.name = data['name']
    customer.email = data['email']
    customer.phone = data['phone']
    customer.location = data['location']
    customer.hobbies = data['hobbies']
    db.session.commit()
    return jsonify(customer.as_dict())

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@my_blueprint.route('/customer/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return '', 204
