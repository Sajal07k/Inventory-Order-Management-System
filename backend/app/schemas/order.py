from decimal import Decimal
from typing import List
from pydantic import BaseModel, Field

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal
    product_name: str

    model_config = {"from_attributes": True}

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: Decimal
    items: List[OrderItemResponse]

    model_config = {"from_attributes": True}
