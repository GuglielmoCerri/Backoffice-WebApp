from app import app, db
from db_schema import Customer, Product, Category, Sale 

def clear_table(model):
    try:
        db.session.query(model).delete()
        db.session.commit()
        print(f"Cleared table {model.__tablename__}")
    except Exception as e:
        db.session.rollback()
        print(f"Failed to clear table {model.__tablename__}: {str(e)}")

if __name__ == "__main__":
    with app.app_context():
        clear_table(Customer)
        clear_table(Product)
        clear_table(Category)
        clear_table(Sale)
    print("Tables cleared successfully!")
