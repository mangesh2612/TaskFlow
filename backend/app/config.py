
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_username: str | None = None
    db_password: str | None = None
    db_host: str = "127.0.0.1"
    db_port: int = 5433
    db_name: str = "taskflow_db"
    database_url: str | None = None

    model_config = SettingsConfigDict(
        env_file="backend/.env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
