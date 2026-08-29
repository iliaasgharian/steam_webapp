"""
Database connection setup.
Creates the SQLAlchemy engine, session factory, and the declarative Base
that every model in app/models/ inherits from.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./steam_games.db"

# check_same_thread=False is only needed for SQLite (FastAPI can use
# the connection from different threads across requests).
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    FastAPI dependency: yields a database session per request and
    closes it automatically afterwards.
    Usage in a router:
        def endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
