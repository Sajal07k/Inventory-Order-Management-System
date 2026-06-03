from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.product_service import create_product, get_products, get_product, update_product, delete_product
from app.database.session import get_db

router = APIRouter()

@router.post("/", response_model=ProductResponse, status_code=201)
def create(product_in: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, product_in)

@router.get("/", response_model=List[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return get_products(db)

@router.get("/{product_id}", response_model=ProductResponse)
def retrieve(product_id: int, db: Session = Depends(get_db)):
    product = get_product(db, product_id)
    if not product:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    return update_product(db, product_id, product_in)

@router.delete("/{product_id}", status_code=204)
def remove(product_id: int, db: Session = Depends(get_db)):
    delete_product(db, product_id)
    return None
