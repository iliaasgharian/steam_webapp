"""
Personal endpoints: profile, search history, favorite games/genres.
Every endpoint here requires a valid auth token (see get_current_user).
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, SearchHistory, FavoriteGame, FavoriteGenre
from app.models.game import Game
from app.models.genre import Genre
from app.schemas.user import (
    UserOut, UserUpdate, SearchHistoryOut,
    FavoriteGameOut, FavoriteGameCreate,
    FavoriteGenreOut, FavoriteGenreCreate,
)
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/users/me", tags=["users"])


@router.get("", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("", response_model=UserOut)
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/search-history", response_model=list[SearchHistoryOut])
def get_search_history(
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user.id)
        .order_by(SearchHistory.searched_at.desc())
        .limit(limit)
        .all()
    )


@router.get("/favorite-games", response_model=list[FavoriteGameOut])
def list_favorite_games(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorites = db.query(FavoriteGame).filter(FavoriteGame.user_id == current_user.id).all()
    return [
        FavoriteGameOut(appid=f.game.appid, name=f.game.name, added_at=f.added_at)
        for f in favorites
    ]


@router.post("/favorite-games", status_code=status.HTTP_201_CREATED)
def add_favorite_game(
    payload: FavoriteGameCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    game = db.query(Game).filter(Game.appid == payload.appid).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    existing = (
        db.query(FavoriteGame)
        .filter(FavoriteGame.user_id == current_user.id, FavoriteGame.game_id == game.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Game already in favorites")

    favorite = FavoriteGame(user_id=current_user.id, game_id=game.id, added_at=datetime.now(timezone.utc))
    db.add(favorite)
    db.commit()
    return {"appid": game.appid, "name": game.name, "added_at": favorite.added_at}


@router.delete("/favorite-games/{appid}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite_game(
    appid: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    game = db.query(Game).filter(Game.appid == appid).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    favorite = (
        db.query(FavoriteGame)
        .filter(FavoriteGame.user_id == current_user.id, FavoriteGame.game_id == game.id)
        .first()
    )
    if not favorite:
        raise HTTPException(status_code=404, detail="Game not in favorites")

    db.delete(favorite)
    db.commit()
    return None


@router.get("/favorite-genres", response_model=list[FavoriteGenreOut])
def list_favorite_genres(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorites = db.query(FavoriteGenre).filter(FavoriteGenre.user_id == current_user.id).all()
    return [FavoriteGenreOut(id=f.genre.id, description=f.genre.description) for f in favorites]


@router.post("/favorite-genres", status_code=status.HTTP_201_CREATED)
def add_favorite_genre(
    payload: FavoriteGenreCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    genre = db.query(Genre).filter(Genre.id == payload.genre_id).first()
    if not genre:
        raise HTTPException(status_code=404, detail="Genre not found")

    existing = (
        db.query(FavoriteGenre)
        .filter(FavoriteGenre.user_id == current_user.id, FavoriteGenre.genre_id == genre.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Genre already in favorites")

    favorite = FavoriteGenre(user_id=current_user.id, genre_id=genre.id)
    db.add(favorite)
    db.commit()
    return {"id": genre.id, "description": genre.description}
