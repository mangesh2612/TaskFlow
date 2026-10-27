
from collections.abc import Generator

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.app.config import settings


if settings.database_url:
    # Use the hosted PostgreSQL connection URL.
    database_url = settings.database_url

    # SQLAlchemy needs the psycopg driver.
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1,
        )
else:
    # Use the separate settings for local development.
    database_url = URL.create(
        drivername="postgresql+psycopg",
        username=settings.db_username,
        password=settings.db_password,
        host=settings.db_host,
        port=settings.db_port,
        database=settings.db_name,
    )


engine = create_engine(database_url, pool_pre_ping=True)

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
