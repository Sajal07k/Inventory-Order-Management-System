from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db


def get_db_session() -> Session:
    return next(get_db())
