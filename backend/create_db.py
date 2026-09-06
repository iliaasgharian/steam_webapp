"""
Run this once to create all tables defined in app/models/.
Works against whichever database DATABASE_URL points to (SQLite by
default, or PostgreSQL if DATABASE_URL is set — see docker-compose.yml).

Usage:
    cd backend
    python create_db.py
"""

from app.database import engine, Base, DATABASE_URL
from app import models  # noqa: F401  (import so all tables register on Base.metadata)

Base.metadata.create_all(bind=engine)
print(f"Database tables created (target: {DATABASE_URL})")
