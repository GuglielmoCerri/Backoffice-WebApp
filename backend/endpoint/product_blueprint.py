import os
import sys; sys.path.insert(1, os.path.join(sys.path[0], '..'))
from flask import Blueprint, jsonify, request
from db_schema import db, Product


product_blueprint = Blueprint('product_blueprint', __name__)

# --------------------- PRODUCT ENDPOINT -----------------------------

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@product_blueprint.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.as_dict() for product in products])

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@product_blueprint.route('/product/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.as_dict())

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@product_blueprint.route('/product', methods=['POST'])
def add_product():
    data = request.get_json()
    new_product = Product(name=data['name'], description=data['description'], price=data['price'], 
                          category=data['category'], stock_quantity=data['stock_quantity'])
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.as_dict()), 201

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@product_blueprint.route('/product/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    product = Product.query.get_or_404(id)
    product.name = data['name']
    product.description = data['description']
    product.price = data['price']
    product.category = data['category']
    product.stock_quantity = data['stock_quantity']
    db.session.commit()
    return jsonify(product.as_dict())

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@product_blueprint.route('/product/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return '', 204
