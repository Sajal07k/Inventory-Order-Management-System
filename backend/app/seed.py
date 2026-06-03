from app.database.session import SessionLocal
from app.models import Product, Customer

sample_products = [
    {"name": "Wireless Mouse", "sku": "WM-1001", "price": 29.99, "quantity_in_stock": 120},
    {"name": "Mechanical Keyboard", "sku": "MK-1002", "price": 79.99, "quantity_in_stock": 65},
    {"name": "HD Monitor", "sku": "HM-1003", "price": 199.99, "quantity_in_stock": 34},
]

sample_customers = [
    {"full_name": "Olivia Daniels", "email": "olivia@example.com", "phone_number": "555-0101"},
    {"full_name": "Marcus Reed", "email": "marcus@example.com", "phone_number": "555-0202"},
]


def seed():
    db = SessionLocal()
    try:
        for data in sample_products:
            if not db.query(Product).filter(Product.sku == data["sku"]).first():
                db.add(Product(**data))

        for data in sample_customers:
            if not db.query(Customer).filter(Customer.email == data["email"]).first():
                db.add(Customer(**data))

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
    print("Sample data seeded.")
