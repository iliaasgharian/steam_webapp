"""
Tests for /api/companies/*
"""


def test_list_companies_empty(client):
    response = client.get("/api/companies")
    assert response.status_code == 200
    assert response.json()["total"] == 0


def test_get_company_detail_success(client, db_session):
    from app.models.company import Company
    from app.models.game import Game

    company = Company(name="Valve", country="United States", founded_year=1996)
    db_session.add(company)
    db_session.commit()
    db_session.refresh(company)

    game = Game(appid=730, name="Counter-Strike 2")
    game.developers.append(company)
    db_session.add(game)
    db_session.commit()

    response = client.get(f"/api/companies/{company.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Valve"
    assert len(data["developed_games"]) == 1
    assert data["developed_games"][0]["appid"] == 730


def test_get_company_detail_not_found(client):
    response = client.get("/api/companies/999999")
    assert response.status_code == 404


def test_list_companies_search_by_name(client, db_session):
    from app.models.company import Company

    db_session.add_all([Company(name="Valve"), Company(name="CD Projekt Red")])
    db_session.commit()

    response = client.get("/api/companies", params={"q": "valve"})
    data = response.json()
    assert data["total"] == 1
    assert data["results"][0]["name"] == "Valve"
