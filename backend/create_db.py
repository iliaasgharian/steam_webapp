"""
Run this once to create steam_games.db with all tables defined in app/models/.

Usage:
    cd backend
    python create_db.py
"""

from app.database import engine, Base
from app import models  # noqa: F401  (import so all tables register on Base.metadata)

Base.metadata.create_all(bind=engine)
print("Database created: steam_games.db")
