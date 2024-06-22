#%%
import os
import sys; sys.path.insert(1, os.path.join(sys.path[0], '..'))
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime
from collections import Counter
import pandas as pd
import matplotlib.pyplot as plt
from db_schema import Customer, Product, Sale
from app import cache
#%%

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
    locations = [customer.location.capitalize() for customer in customers]
    location_count = Counter(locations)
    total_customers = len(customers)
    
    location_percentages = [
        {'label': location, 'value': round((count / total_customers) * 100,2)}
        for location, count in location_count.items()
    ]
    
    colors = plt.get_cmap('tab20').colors
    color_hex = ['#%02x%02x%02x' % (int(r*255), int(g*255), int(b*255)) for r, g, b in colors]

    for i, location in enumerate(location_percentages):
        location["color"] = color_hex[i % len(color_hex)]

    return jsonify(location_percentages)

@cache.cached(timeout=600)  # Cache this function for 600 seconds (10 minutes)
def fetch_sales_join_products():
    sales = Sale.query.all()
    sales_data = [{'product': p.product, 'date': p.date, 'quantity': p.quantity} for p in sales]
    df_sales = pd.DataFrame(sales_data)

    products = Product.query.all()
    products_data = [{'name': p.name, 'category': p.category, 'price': p.price, 'stock_quantity': p.stock_quantity} for p in products]
    df_products = pd.DataFrame(products_data)
    df_products.rename({'name': 'product'}, axis=1, inplace=True)

    merge = df_sales.merge(df_products, on='product')
    merge['takings'] = merge['price'] * merge['quantity']

    return merge

@analytics_blueprint.route('/analytics/top_selled_products', methods=['GET'])
def get_top_selled_products():
    merge = fetch_sales_join_products()

    grouped_df = merge[['product','quantity']].groupby('product').agg({
        'quantity': 'sum',
    }).reset_index()  
    grouped_df.sort_values("quantity",inplace=True,ascending=False)

    return jsonify(grouped_df.head(5).to_dict(orient='records'))

@analytics_blueprint.route('/analytics/trend', methods=['GET'])
def get_trend():
    merge = fetch_sales_join_products()

    merge = merge[['date','category','takings']]
    merge['date'] = merge['date'].dt.strftime('%Y-%m')

    current_year = str(datetime.now().year)
    merge = merge[merge['date'].str.startswith(current_year)]
    merge.sort_values("date",inplace=True)

    return jsonify(merge.to_dict(orient='records'))