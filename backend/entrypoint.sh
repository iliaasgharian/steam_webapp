#!/bin/sh
# Wait for the database to actually accept connections (matters most
# for PostgreSQL right after docker-compose starts it).
python wait_for_db.py

# Ensures the database and its tables exist before the server starts.
# Safe to run every time the container starts: create_all() only creates
# tables that don't already exist, it won't wipe existing data.
python create_db.py

# Multiple worker processes let CPU-heavy work (like bcrypt password
# hashing in /api/auth/*) run in parallel instead of queuing behind a
# single process. Tune the worker count to your machine's CPU cores.
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
