from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    backend_host: str = Field("0.0.0.0", alias="BACKEND_HOST")
    backend_port: int = Field(8000, alias="BACKEND_PORT")

    model_config = {"populate_by_name": True}


settings = Settings()

