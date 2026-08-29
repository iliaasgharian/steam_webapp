"""
Public lookup endpoints: /api/genres and /api/categories.
Kept in one file since both are simple, near-identical lookup lists.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.genre import Genre
from app.models.category import Category
from app.schemas.game import GenreOut, CategoryOut

router = APIRouter(tags=["genres & categories"])


@router.get("/api/genres", response_model=list[GenreOut])
def list_genres(db: Session = Depends(get_db)):
    return db.query(Genre).order_by(Genre.description.asc()).all()


@router.get("/api/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.description.asc()).all()
