"""
Tests for /api/users/me/* — all require authentication.
"""


def test_get_profile_requires_auth(client):
    response = client.get("/api/users/me")
    assert response.status_code == 401


def test_get_profile_with_valid_token(client, auth_headers, registered_user):
    response = client.get("/api/users/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == registered_user["email"]


def test_update_profile(client, auth_headers):
    response = client.put(
        "/api/users/me",
        headers=auth_headers,
        json={"full_name": "Updated Name", "country": "Germany"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"
    assert data["country"] == "Germany"


def test_favorite_games_empty_by_default(client, auth_headers):
    response = client.get("/api/users/me/favorite-games", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_add_favorite_game_not_found(client, auth_headers):
    # No games exist in the test database yet.
    response = client.post(
        "/api/users/me/favorite-games", headers=auth_headers, json={"appid": 999999}
    )
    assert response.status_code == 404


def test_add_and_list_favorite_game(client, auth_headers, db_session):
    from app.models.game import Game

    game = Game(appid=730, name="Counter-Strike 2")
    db_session.add(game)
    db_session.commit()

    response = client.post(
        "/api/users/me/favorite-games", headers=auth_headers, json={"appid": 730}
    )
    assert response.status_code == 201

    response = client.get("/api/users/me/favorite-games", headers=auth_headers)
    assert response.status_code == 200
    favorites = response.json()
    assert len(favorites) == 1
    assert favorites[0]["appid"] == 730


def test_add_duplicate_favorite_game_fails(client, auth_headers, db_session):
    from app.models.game import Game

    game = Game(appid=730, name="Counter-Strike 2")
    db_session.add(game)
    db_session.commit()

    client.post("/api/users/me/favorite-games", headers=auth_headers, json={"appid": 730})
    response = client.post(
        "/api/users/me/favorite-games", headers=auth_headers, json={"appid": 730}
    )
    assert response.status_code == 409


def test_remove_favorite_game(client, auth_headers, db_session):
    from app.models.game import Game

    game = Game(appid=730, name="Counter-Strike 2")
    db_session.add(game)
    db_session.commit()

    client.post("/api/users/me/favorite-games", headers=auth_headers, json={"appid": 730})
    response = client.delete("/api/users/me/favorite-games/730", headers=auth_headers)
    assert response.status_code == 204

    response = client.get("/api/users/me/favorite-games", headers=auth_headers)
    assert response.json() == []


def test_search_history_empty_by_default(client, auth_headers):
    response = client.get("/api/users/me/search-history", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []
