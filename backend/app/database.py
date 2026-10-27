from sqlalchemy import URL, create_engine

from backend.app.config import settings

from collections.abc import Generator
from sqlalchemy.orm import Session, sessionmaker

database_url = URL.create(
    drivername='postgresql+psycopg',
    username=settings.db_username,
    password=settings.db_password,
    host=settings.db_host,
    port=settings.db_port,
    database=settings.db_name,
)

engine = create_engine(database_url)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()