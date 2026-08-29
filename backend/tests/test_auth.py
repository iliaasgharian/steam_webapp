"""
Tests for /api/auth/*
"""


def test_register_success(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "new@example.com", "password": "mypassword", "full_name": "New User"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@example.com"
    assert data["full_name"] == "New User"
    assert "password" not in data
    assert "password_hash" not in data


def test_register_duplicate_email_fails(client, registered_user):
    response = client.post(
        "/api/auth/register",
        json={"email": registered_user["email"], "password": "anotherpassword"},
    )
    assert response.status_code == 409


def test_login_success(client, registered_user):
    response = client.post("/api/auth/login", json=registered_user)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_fails(client, registered_user):
    response = client.post(
        "/api/auth/login",
        json={"email": registered_user["email"], "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_login_nonexistent_user_fails(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "whatever"},
    )
    assert response.status_code == 401


def test_logout_returns_no_content(client, auth_headers):
    response = client.post("/api/auth/logout", headers=auth_headers)
    assert response.status_code == 204
