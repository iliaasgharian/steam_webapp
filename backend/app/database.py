"""
Database connection setup.
Creates the SQLAlchemy engine, session factory, and the declarative Base
that every model in app/models/ inherits from.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool

DATABASE_URL = "sqlite:///./steam_games.db"

# check_same_thread=False is only needed for SQLite (FastAPI can use
# the connection from different threads across requests).
#
# pool_size / max_overflow: the default (5 + 10 = 15 concurrent
# connections) is too small under real concurrent load and causes
# "QueuePool limit ... connection timed out" errors once traffic
# exceeds ~15 simultaneous in-flight requests. Raised here based on
# stress testing. Note SQLite itself only allows one writer at a time
# regardless of pool size — this mainly helps concurrent readers, and
# lets writers queue briefly instead of the pool rejecting them outright.
# For much higher write concurrency, moving to PostgreSQL is the real fix.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 30},
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=40,
    pool_timeout=30,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


@event.listens_for(engine, "connect")
def _set_sqlite_pragmas(dbapi_connection, connection_record):
    """
    WAL (Write-Ahead Logging) mode lets readers keep working while a
    write is in progress, instead of SQLite's default behavior of
    blocking all readers during a write. This matters once multiple
    worker processes (see entrypoint.sh --workers) share the same
    SQLite file under concurrent load.
    """
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA busy_timeout=30000")
    cursor.close()


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
