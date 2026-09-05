#!/bin/sh
# Ensures the database and its tables exist before the server starts.
# Safe to run every time the container starts: create_all() only creates
# tables that don't already exist, it won't wipe existing data.
python create_db.py
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
