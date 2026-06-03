from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import Order, OrderItem, Product, Customer
from app.schemas.order import OrderCreate


def _calculate_order_total(items: list[OrderItem]) -> Decimal:
    return sum(item.quantity * item.unit_price for item in items)


def create_order(db: Session, order_in: OrderCreate) -> Order:
    customer = db.query(Customer).filter(Customer.id == order_in.customer_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")

    order_items: list[OrderItem] = []
    for item_data in order_in.items:
        product = db.query(Product).filter(Product.id == item_data.product_id).with_for_update().first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item_data.product_id} not found.")
        if item_data.quantity > product.quantity_in_stock:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Not enough stock for product '{product.name}'.")
        product.quantity_in_stock -= item_data.quantity
        if product.quantity_in_stock < 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product quantity cannot be negative.")

        order_items.append(OrderItem(product_id=product.id, quantity=item_data.quantity, unit_price=product.price))

    order = Order(customer_id=customer.id, total_amount=_calculate_order_total(order_items), items=order_items)
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def get_orders(db: Session) -> list[Order]:
    return db.query(Order).order_by(Order.id).all()


def get_order(db: Session, order_id: int) -> Order | None:
    return db.query(Order).filter(Order.id == order_id).first()


def delete_order(db: Session, order_id: int) -> None:
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.quantity_in_stock += item.quantity
    db.delete(order)
    db.commit()
