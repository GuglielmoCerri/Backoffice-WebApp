import os
import sys; sys.path.insert(1, os.path.join(sys.path[0], '..'))
from flask import Blueprint, jsonify, request
from db_schema import db, Category

category_blueprint = Blueprint('category_blueprint', __name__)

# --------------------- CATEGORY ENDPOINT -----------------------------

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@category_blueprint.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.as_dict() for category in categories])

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@category_blueprint.route('/category/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get_or_404(id)
    return jsonify(category.as_dict())

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@category_blueprint.route('/category', methods=['POST'])
def add_category():
    data = request.get_json()
    new_category = Category(name=data['name'], description=data.get('description'))
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.as_dict()), 201

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@category_blueprint.route('/category/<int:id>', methods=['PUT'])
def update_category(id):
    data = request.get_json()
    category = Category.query.get_or_404(id)
    category.name = data['name']
    category.description = data.get('description', category.description)
    category.status = data.get('status', category.status)
    db.session.commit()
    return jsonify(category.as_dict())

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@category_blueprint.route('/category/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return '', 204
