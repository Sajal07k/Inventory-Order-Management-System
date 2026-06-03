from decimal import Decimal
from typing import Annotated
from pydantic import BaseModel, Field
from pydantic import StringConstraints

class ProductBase(BaseModel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
    sku: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
    price: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    quantity_in_stock: int = Field(ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)] | None = None
    sku: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)] | None = None
    price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    quantity_in_stock: int | None = Field(default=None, ge=0)

class ProductResponse(ProductBase):
    id: int

    model_config = {"from_attributes": True}
