import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from blueprint import my_blueprint

from backend.db_schema import db


load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

db.init_app(app)
app.register_blueprint(my_blueprint)

CORS(app)
jwt = JWTManager(app)

# ------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)