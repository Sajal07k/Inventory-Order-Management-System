from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import products, customers, orders
from app.core.config import settings
from app.database.session import engine
from app.database.base import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Order Management API",
    version="1.0.0",
    description="Backend API for inventory and order management.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(customers.router, prefix="/customers", tags=["Customers"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])

@app.get("/")
def root():
    return {"message": "Inventory Order Management API is running."}
