"""
Public endpoints for browsing and searching games.
"""

import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.game import Game
from app.models.genre import Genre
from app.models.category import Category
from app.models.player_snapshot import PlayerSnapshot
from app.schemas.game import (
    GameListResponse, GameListItem, GameDetail, PlayerHistoryResponse, PlayerSnapshotOut,
)

router = APIRouter(prefix="/api/games", tags=["games"])


def _game_to_detail(game: Game) -> GameDetail:
    return GameDetail(
        appid=game.appid,
        name=game.name,
        type=game.type,
        is_free=game.is_free,
        short_description=game.short_description,
        detailed_description=game.detailed_description,
        header_image=game.header_image,
        release_date=game.release_date,
        is_released=game.is_released,
        price_initial=game.price_initial,
        price_final=game.price_final,
        discount_percent=game.discount_percent,
        currency=game.currency,
        metacritic_score=game.metacritic_score,
        positive_reviews=game.positive_reviews,
        negative_reviews=game.negative_reviews,
        genres=[g.description for g in game.genres],
        categories=[c.description for c in game.categories],
        developers=[d.name for d in game.developers],
        publishers=[p.name for p in game.publishers],
        screenshots=json.loads(game.screenshots) if game.screenshots else [],
        movies=json.loads(game.movies) if game.movies else [],
    )


@router.get("", response_model=GameListResponse)
def list_games(
    q: Optional[str] = Query(None, description="Search by game name"),
    genre: Optional[str] = Query(None, description="Filter by genre name"),
    category: Optional[str] = Query(None, description="Filter by category name"),
    min_price: Optional[int] = Query(None, ge=0),
    max_price: Optional[int] = Query(None, ge=0),
    platform: Optional[str] = Query(None, pattern="^(windows|mac|linux)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Game)

    if q:
        query = query.filter(Game.name.ilike(f"%{q}%"))
    if genre:
        query = query.join(Game.genres).filter(Genre.description.ilike(genre))
    if category:
        query = query.join(Game.categories).filter(Category.description.ilike(category))
    if min_price is not None:
        query = query.filter(Game.price_final >= min_price)
    if max_price is not None:
        query = query.filter(Game.price_final <= max_price)
    if platform:
        column = {"windows": Game.platforms_windows, "mac": Game.platforms_mac, "linux": Game.platforms_linux}[platform]
        query = query.filter(column.is_(True))

    total = query.count()
    games = query.offset((page - 1) * page_size).limit(page_size).all()

    results = [
        GameListItem(
            appid=g.appid,
            name=g.name,
            header_image=g.header_image,
            price_final=g.price_final,
            is_free=g.is_free,
            genres=[genre.description for genre in g.genres],
        )
        for g in games
    ]
    return GameListResponse(total=total, page=page, page_size=page_size, results=results)


@router.get("/{appid}", response_model=GameDetail)
def get_game(appid: int, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.appid == appid).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return _game_to_detail(game)


@router.get("/{appid}/players", response_model=PlayerHistoryResponse)
def get_player_history(
    appid: int,
    range: str = Query("24h", pattern="^(24h|7d|30d|all)$"),
    db: Session = Depends(get_db),
):
    game = db.query(Game).filter(Game.appid == appid).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    query = db.query(PlayerSnapshot).filter(PlayerSnapshot.game_id == game.id)
    # NOTE: actual time-window filtering (24h/7d/30d) should be added once
    # snapshots exist; left as "all" behavior for now since the fetch script
    # that populates this table hasn't been built yet.
    snapshots = query.order_by(PlayerSnapshot.recorded_at.asc()).all()

    return PlayerHistoryResponse(
        appid=appid,
        range=range,
        data=[PlayerSnapshotOut(recorded_at=s.recorded_at, player_count=s.player_count) for s in snapshots],
    )
