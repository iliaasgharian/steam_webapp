"""
Tests for /api/genres and /api/categories
"""


def test_list_genres_empty(client):
    response = client.get("/api/genres")
    assert response.status_code == 200
    assert response.json() == []


def test_list_genres_returns_data(client, db_session):
    from app.models.genre import Genre

    db_session.add_all([Genre(description="Action"), Genre(description="RPG")])
    db_session.commit()

    response = client.get("/api/genres")
    data = response.json()
    descriptions = sorted(g["description"] for g in data)
    assert descriptions == ["Action", "RPG"]


def test_list_categories_returns_data(client, db_session):
    from app.models.category import Category

    db_session.add(Category(description="Single-player"))
    db_session.commit()

    response = client.get("/api/categories")
    data = response.json()
    assert data[0]["description"] == "Single-player"
