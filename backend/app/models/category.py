"""
Category/tag lookup table + the game<->category junction table (game_categories).
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Table
from app.database import Base

game_categories = Table(
    "game_categories",
    Base.metadata,
    Column("game_id", Integer, ForeignKey("games.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True),
)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    steam_category_id = Column(Integer, nullable=True)
    description = Column(String, nullable=False, unique=True)
