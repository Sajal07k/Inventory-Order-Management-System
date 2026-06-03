from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Customer
from app.schemas.customer import CustomerCreate
from fastapi import HTTPException, status


def create_customer(db: Session, customer_in: CustomerCreate) -> Customer:
    customer = Customer(**customer_in.model_dump())
    db.add(customer)
    try:
        db.commit()
        db.refresh(customer)
    except IntegrityError as exc:
        db.rollback()
        if "unique" in str(exc).lower():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Customer email must be unique.")
        raise
    return customer


def get_customers(db: Session) -> list[Customer]:
    return db.query(Customer).order_by(Customer.id).all()


def get_customer(db: Session, customer_id: int) -> Customer | None:
    return db.query(Customer).filter(Customer.id == customer_id).first()


def delete_customer(db: Session, customer_id: int) -> None:
    customer = get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")
    db.delete(customer)
    db.commit()
