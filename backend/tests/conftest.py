"""
Shared pytest fixtures.

Key idea: tests must NEVER touch steam_games.db (the real database).
We override the get_db dependency to use a separate, throwaway SQLite
file (or in-memory) database instead, recreated fresh for every test.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, get_db
from app import models  # noqa: F401  ensures all tables are registered

TEST_DATABASE_URL = "sqlite:///./test_steam_games.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Fresh database schema for every single test function."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """TestClient with the get_db dependency overridden to use the test DB."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def registered_user(client):
    """Registers a user and returns (email, password) for reuse in tests."""
    email = "test@example.com"
    password = "secret123"
    client.post("/api/auth/register", json={"email": email, "password": password, "full_name": "Test User"})
    return {"email": email, "password": password}


@pytest.fixture
def auth_headers(client, registered_user):
    """Logs in the registered_user and returns ready-to-use Authorization headers."""
    response = client.post("/api/auth/login", json=registered_user)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
