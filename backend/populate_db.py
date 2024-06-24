import random
from faker import Faker
from db_schema import Customer, Product, Category, Sale 
from app import app, db

fake = Faker(['it_IT', 'en_US'])

categories_list = [
    {"name": "Technology", "description": "Technological and electronic products."},
    {"name": "Home", "description": "Products for home."},
    {"name": "Clothing", "description": "Clothing and accessories."}
]

products_list = {
    "Technology": ["Smartphone", "Laptop", "Tablet", "Monitor", "Printer", "TV", "Headphones", "Camera"],
    "Home": ["Detergent", "Sponges", "Lamps", "Chairs", "Tables", "Beds"],
    "Clothing": ["T-shirt", "Jeans", "Jacket", "Shoes", "Hat"]
}

def create_fake_customers(n):
    for _ in range(n):
        customer = Customer(
            name=fake.name(),
            email=fake.email(),
            phone=fake.phone_number(),
            location=fake.country(),
            hobbies=", ".join(fake.words(nb=3))
        )
        db.session.add(customer)
    db.session.commit()

def create_fake_categories():
    for category in categories_list:
        cat = Category(
            name=category["name"],
            description=category["description"],
            status=True
        )
        db.session.add(cat)
    db.session.commit()

def create_fake_products():
    categories = Category.query.all()
    for category in categories:
        for product_name in products_list[category.name]:
            product = Product(
                name=product_name,
                description=f"Description for {product_name}",
                price=round(random.uniform(10.0, 1000.0), 2),
                category=category.name,
                stock_quantity=random.randint(1, 100)
            )
            db.session.add(product)
    db.session.commit()

def create_fake_sales(n):
    customers = Customer.query.all()
    products = Product.query.all()
    for _ in range(n):
        sale = Sale(
            product=random.choice(products).name,
            customer=random.choice(customers).name,
            date=fake.date_time_this_year(),
            quantity=random.randint(1, 10),
        )
        db.session.add(sale)
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        create_fake_customers(20)
        create_fake_categories()
        create_fake_products()
        create_fake_sales(100)
    print("Database populated!")
