import os
from flask import Flask
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from endpoint.login_blueprint import login_blueprint
from endpoint.customer_blueprint import customer_blueprint
from endpoint.product_blueprint import product_blueprint
from endpoint.category_blueprint import category_blueprint
from db_schema import db


load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

db.init_app(app)
app.register_blueprint(login_blueprint)
app.register_blueprint(customer_blueprint)
app.register_blueprint(product_blueprint)
app.register_blueprint(category_blueprint)

CORS(app)
jwt = JWTManager(app)

# ------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)