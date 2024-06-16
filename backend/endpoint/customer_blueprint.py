import os
import sys; sys.path.insert(1, os.path.join(sys.path[0], '..'))
from flask import Blueprint, jsonify, request
from db_schema import db, Customer


customer_blueprint = Blueprint('customer_blueprint', __name__)

# --------------------- CUSTOMERS ENDPOINT -----------------------------

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@customer_blueprint.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return jsonify([customer.as_dict() for customer in customers])

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@customer_blueprint.route('/customer/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get_or_404(id)
    return jsonify(customer.as_dict())

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@customer_blueprint.route('/customer', methods=['POST'])
def add_customer():
    data = request.get_json()
    new_customer = Customer(name=data['name'], email=data['email'], phone=data['phone'], location=data['location'], hobbies=data['hobbies'])
    db.session.add(new_customer)
    db.session.commit()
    return jsonify(new_customer.as_dict()), 201

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@customer_blueprint.route('/customer/<int:id>', methods=['PUT'])
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
@customer_blueprint.route('/customer/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return '', 204
