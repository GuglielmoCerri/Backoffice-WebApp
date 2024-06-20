import os
import sys; sys.path.insert(1, os.path.join(sys.path[0], '..'))
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from collections import Counter
import pandas as pd
from db_schema import Customer, Product

analytics_blueprint = Blueprint('analytics_blueprint', __name__)

@analytics_blueprint.route('/analytics/products_by_category', methods=['GET'])
@jwt_required()
def products_by_category():
    products = Product.query.all()
    data = [{'category': p.category, 'price': p.price, 'stock_quantity': p.stock_quantity} for p in products]
    df = pd.DataFrame(data)
    
    result = df.groupby('category').agg({
        'price': ['mean', 'sum', 'count'],
        'stock_quantity': ['sum']
    }).reset_index()
    
    result.columns = ['category', 'average_price', 'total_revenue', 'product_count', 'total_stock']
    return jsonify(result.to_dict(orient='records'))

@analytics_blueprint.route('/analytics/products_by_price_range', methods=['GET'])
@jwt_required()
def products_by_price_range():
    products = Product.query.all()
    data = [{'price': p.price} for p in products]
    df = pd.DataFrame(data)
    
    bins = [0, 50, 100, 200, 500, 1000, float('inf')]
    labels = ['0-50', '50-100', '100-200', '200-500', '500-1000', '1000+']
    df['price_range'] = pd.cut(df['price'], bins=bins, labels=labels, right=False)
    
    result = df['price_range'].value_counts().reset_index()
    result.columns = ['price_range', 'product_count']
    return jsonify(result.to_dict(orient='records'))

@analytics_blueprint.route('/analytics/customers_by_location', methods=['GET'])
def get_customers_by_location():
    customers = Customer.query.all()
    locations = [customer.location for customer in customers]
    location_count = Counter(locations)
    total_customers = len(customers)
    
    location_percentages = [
        {'label': location, 'value': (count / total_customers) * 100}
        for location, count in location_count.items()
    ]
    
    return jsonify(location_percentages)