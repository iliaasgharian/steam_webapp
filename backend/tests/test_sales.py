"""
Tests for /api/sales-charts
"""


def test_sales_chart_missing_period_param(client):
    response = client.get("/api/sales-charts")
    assert response.status_code == 422  # required query param missing


def test_sales_chart_invalid_period_value(client):
    response = client.get("/api/sales-charts", params={"period": "daily"})
    assert response.status_code == 422


def test_sales_chart_no_data_yet(client):
    response = client.get("/api/sales-charts", params={"period": "weekly"})
    assert response.status_code == 404


def test_sales_chart_returns_latest_period(client, db_session):
    from datetime import date, datetime, timezone
    from app.models.game import Game
    from app.models.sales_chart import SalesChart

    game1 = Game(appid=730, name="Counter-Strike 2")
    game2 = Game(appid=570, name="Dota 2")
    db_session.add_all([game1, game2])
    db_session.commit()

    db_session.add_all([
        SalesChart(
            game_id=game1.id, period_type="weekly", rank=1,
            period_start=date(2026, 8, 24), period_end=date(2026, 8, 30),
            recorded_at=datetime.now(timezone.utc),
        ),
        SalesChart(
            game_id=game2.id, period_type="weekly", rank=2,
            period_start=date(2026, 8, 24), period_end=date(2026, 8, 30),
            recorded_at=datetime.now(timezone.utc),
        ),
    ])
    db_session.commit()

    response = client.get("/api/sales-charts", params={"period": "weekly"})
    assert response.status_code == 200
    data = response.json()
    assert data["period_type"] == "weekly"
    assert len(data["rankings"]) == 2
    assert data["rankings"][0]["rank"] == 1
    assert data["rankings"][0]["appid"] == 730
