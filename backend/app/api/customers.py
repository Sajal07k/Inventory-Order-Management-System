from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.customer import CustomerCreate, CustomerResponse
from app.services.customer_service import create_customer, get_customers, get_customer, delete_customer
from app.database.session import get_db

router = APIRouter()

@router.post("/", response_model=CustomerResponse, status_code=201)
def create(customer_in: CustomerCreate, db: Session = Depends(get_db)):
    return create_customer(db, customer_in)

@router.get("/", response_model=List[CustomerResponse])
def list_customers(db: Session = Depends(get_db)):
    return get_customers(db)

@router.get("/{customer_id}", response_model=CustomerResponse)
def retrieve(customer_id: int, db: Session = Depends(get_db)):
    customer = get_customer(db, customer_id)
    if not customer:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")
    return customer

@router.delete("/{customer_id}", status_code=204)
def remove(customer_id: int, db: Session = Depends(get_db)):
    delete_customer(db, customer_id)
    return None
