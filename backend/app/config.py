from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    db_username: str
    db_password: str
    db_host: str = "127.0.0.1"
    db_port: int = 5433
    db_name: str = "taskflow_db"

    model_config = SettingsConfigDict(
        env_file="backend/.env",
        env_file_encoding="utf-8",
        extra= "ignore",
    )

settings = Settings()