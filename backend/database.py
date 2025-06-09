import pandas as pd
from models import db, Product

def init_db():
    """
    Initializes the database and creates tables.
    This function is called within an application context, so it can access db.
    """
    db.drop_all()
    db.create_all()

def populate_db():
    """
    Populates the database with mock product data from a CSV file.
    This function is also called within an application context.
    """
    # Check if products already exist to avoid populating multiple times
    if Product.query.first() is None:
        try:
            products_df = pd.read_csv('mock_products.csv', quotechar='"')
        
            for index, row in products_df.iterrows():
                product = Product(
                    name=row['name'],
                    category=row['category'],
                    price=row['price'],
                    description=row['description'],
                    image_url=row['image_url']
                )
                db.session.add(product)
            db.session.commit()
            print(f"Added {len(products_df)} products to the database.")
        except FileNotFoundError:
            print("Error: mock_products.csv not found. Please ensure it's in the 'backend' directory.")
    else:
        print("Database already contains products.")