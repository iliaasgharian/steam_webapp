"""
Tests for /api/games/*
"""


def _create_game(db_session, **overrides):
    from app.models.game import Game

    defaults = dict(appid=730, name="Counter-Strike 2", is_free=True, price_final=0)
    defaults.update(overrides)
    game = Game(**defaults)
    db_session.add(game)
    db_session.commit()
    db_session.refresh(game)
    return game


def test_list_games_empty(client):
    response = client.get("/api/games")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["results"] == []


def test_list_games_returns_created_game(client, db_session):
    _create_game(db_session)
    response = client.get("/api/games")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["results"][0]["appid"] == 730
    assert data["results"][0]["name"] == "Counter-Strike 2"


def test_list_games_search_by_name(client, db_session):
    _create_game(db_session, appid=730, name="Counter-Strike 2")
    _create_game(db_session, appid=570, name="Dota 2")

    response = client.get("/api/games", params={"q": "counter"})
    data = response.json()
    assert data["total"] == 1
    assert data["results"][0]["name"] == "Counter-Strike 2"


def test_list_games_filter_by_price(client, db_session):
    _create_game(db_session, appid=730, name="Free Game", price_final=0, is_free=True)
    _create_game(db_session, appid=570, name="Paid Game", price_final=1999, is_free=False)

    response = client.get("/api/games", params={"max_price": 0})
    data = response.json()
    assert data["total"] == 1
    assert data["results"][0]["appid"] == 730


def test_get_game_detail_success(client, db_session):
    _create_game(db_session)
    response = client.get("/api/games/730")
    assert response.status_code == 200
    data = response.json()
    assert data["appid"] == 730
    assert data["name"] == "Counter-Strike 2"


def test_get_game_detail_not_found(client):
    response = client.get("/api/games/999999")
    assert response.status_code == 404


def test_get_player_history_empty(client, db_session):
    _create_game(db_session)
    response = client.get("/api/games/730/players")
    assert response.status_code == 200
    data = response.json()
    assert data["appid"] == 730
    assert data["data"] == []


def test_get_player_history_game_not_found(client):
    response = client.get("/api/games/999999/players")
    assert response.status_code == 404


def test_get_player_history_with_data(client, db_session):
    from datetime import datetime, timezone
    from app.models.player_snapshot import PlayerSnapshot

    game = _create_game(db_session)
    snapshot = PlayerSnapshot(
        game_id=game.id, player_count=812345, recorded_at=datetime.now(timezone.utc)
    )
    db_session.add(snapshot)
    db_session.commit()

    response = client.get("/api/games/730/players")
    data = response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["player_count"] == 812345


def test_list_games_pagination(client, db_session):
    for i in range(25):
        _create_game(db_session, appid=1000 + i, name=f"Game {i}")

    response = client.get("/api/games", params={"page": 1, "page_size": 10})
    data = response.json()
    assert data["total"] == 25
    assert len(data["results"]) == 10

    response = client.get("/api/games", params={"page": 3, "page_size": 10})
    data = response.json()
    assert len(data["results"]) == 5
