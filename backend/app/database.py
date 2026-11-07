import os
from dotenv import load_dotenv
from pathlib import Path
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# подгружаем бд
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

database_url = URL.create(
    "postgresql+psycopg",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME
)
engine = create_engine(database_url)

class Base(DeclarativeBase):
    pass

# создание сессии
SessionLocal = sessionmaker(bind=engine)