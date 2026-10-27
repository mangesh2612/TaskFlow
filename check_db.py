from sqlalchemy import text
from backend.app.database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT current_database()"))
        database_name = result.scalar_one()

        print("Database connected successfull")
        print(f"Database name: {database_name}")

except Exception as error:
    print("Database connection failed")
    print(f"Error type: {type(error).__name__}")
    print(f"Details: {error}")