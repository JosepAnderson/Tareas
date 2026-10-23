import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Base de datos local SQLite, siempre ubicada junto a este archivo.
DATABASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "colegio.db"))
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_PATH.replace(os.path.sep, '/')}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
