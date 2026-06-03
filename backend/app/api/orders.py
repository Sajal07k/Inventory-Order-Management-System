from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import create_order, get_orders, get_order, delete_order
from app.database.session import get_db

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=201)
def create(order_in: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, order_in)

@router.get("/", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return get_orders(db)

@router.get("/{order_id}", response_model=OrderResponse)
def retrieve(order_id: int, db: Session = Depends(get_db)):
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
    return order

@router.delete("/{order_id}", status_code=204)
def remove(order_id: int, db: Session = Depends(get_db)):
    delete_order(db, order_id)
    return None
