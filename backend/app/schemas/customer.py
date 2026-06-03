from pydantic import BaseModel, EmailStr
from typing import Annotated
from pydantic import StringConstraints

class CustomerBase(BaseModel):
    full_name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
    email: EmailStr
    phone_number: Annotated[str, StringConstraints(strip_whitespace=True, min_length=0, max_length=50)] | None = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int

    model_config = {"from_attributes": True}
