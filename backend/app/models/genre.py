"""
Genre lookup table + the game<->genre junction table (game_genres).
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Table
from app.database import Base

# Junction table for the Many-to-Many relationship between games and genres.
# A plain Table (not a class) is enough since it has no extra columns of its own.
game_genres = Table(
    "game_genres",
    Base.metadata,
    Column("game_id", Integer, ForeignKey("games.id"), primary_key=True),
    Column("genre_id", Integer, ForeignKey("genres.id"), primary_key=True),
)


class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    steam_genre_id = Column(Integer, nullable=True)
    description = Column(String, nullable=False, unique=True)
