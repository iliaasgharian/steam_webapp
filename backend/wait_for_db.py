"""
Waits until the database is actually accepting connections before
proceeding. Useful right after container startup, since a healthy
docker-compose dependency doesn't always mean the DB is 100% ready
for new connections the instant it reports healthy.
"""

import sys
import time

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

from app.database import DATABASE_URL

MAX_RETRIES = 30
DELAY_SECONDS = 1

engine = create_engine(DATABASE_URL)

for attempt in range(1, MAX_RETRIES + 1):
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(f"Database is ready (after {attempt} attempt(s)).")
        sys.exit(0)
    except OperationalError:
        print(f"Database not ready yet, retrying ({attempt}/{MAX_RETRIES})...")
        time.sleep(DELAY_SECONDS)

print("Database never became ready — giving up.")
sys.exit(1)
