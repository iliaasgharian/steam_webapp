"""
Database connection setup.
Creates the SQLAlchemy engine, session factory, and the declarative Base
that every model in app/models/ inherits from.

Supports both SQLite (default, zero setup — good for local dev) and
PostgreSQL (set DATABASE_URL, e.g. via docker-compose, for real
concurrent-write workloads). Which one is active depends entirely on
the DATABASE_URL environment variable.
"""

import os

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./steam_games.db")
IS_SQLITE = DATABASE_URL.startswith("sqlite")

if IS_SQLITE:
    # check_same_thread=False is only needed for SQLite (FastAPI can use
    # the connection from different threads across requests).
    #
    # Stress testing showed SQLite's single-writer lock becomes a real
    # bottleneck around 500-1000 concurrent users regardless of pool
    # size — these settings help, but PostgreSQL (see below) is the
    # actual fix for high write concurrency.
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False, "timeout": 30},
        poolclass=QueuePool,
        pool_size=20,
        max_overflow=40,
        pool_timeout=30,
    )

    @event.listens_for(engine, "connect")
    def _set_sqlite_pragmas(dbapi_connection, connection_record):
        """
        WAL (Write-Ahead Logging) mode lets readers keep working while a
        write is in progress, instead of SQLite's default behavior of
        blocking all readers during a write.
        """
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA busy_timeout=30000")
        cursor.close()

else:
    # PostgreSQL (or any other real database server): connections are
    # cheap to pool since the server itself handles concurrent writers
    # properly, unlike SQLite's single-file lock.
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=20,
        max_overflow=40,
        pool_timeout=30,
        pool_pre_ping=True,  # detects and recovers from dropped connections
    )

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
