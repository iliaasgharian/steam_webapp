"""
The core Game model — one row per Steam appid.
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.genre import game_genres
from app.models.category import game_categories
from app.models.company import game_developers, game_publishers


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    appid = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    type = Column(String, nullable=True)
    is_free = Column(Boolean, default=False)

    short_description = Column(Text, nullable=True)
    detailed_description = Column(Text, nullable=True)
    header_image = Column(String, nullable=True)

    release_date = Column(String, nullable=True)
    is_released = Column(Boolean, default=True)

    price_initial = Column(Integer, nullable=True)   # cents
    price_final = Column(Integer, nullable=True)      # cents
    discount_percent = Column(Integer, nullable=True)
    currency = Column(String, nullable=True)

    platforms_windows = Column(Boolean, default=False)
    platforms_mac = Column(Boolean, default=False)
    platforms_linux = Column(Boolean, default=False)

    metacritic_score = Column(Integer, nullable=True)
    positive_reviews = Column(Integer, nullable=True)
    negative_reviews = Column(Integer, nullable=True)

    pc_requirements_min = Column(Text, nullable=True)
    pc_requirements_rec = Column(Text, nullable=True)

    screenshots = Column(Text, nullable=True)  # JSON-encoded list of URLs
    movies = Column(Text, nullable=True)       # JSON-encoded list of URLs

    last_fetched_at = Column(DateTime, nullable=True)
    fetch_success = Column(Boolean, default=True)

    # Relationships
    genres = relationship("Genre", secondary=game_genres, backref="games")
    categories = relationship("Category", secondary=game_categories, backref="games")
    developers = relationship("Company", secondary=game_developers, backref="developed_games")
    publishers = relationship("Company", secondary=game_publishers, backref="published_games")

    player_snapshots = relationship("PlayerSnapshot", back_populates="game")
    sales_chart_entries = relationship("SalesChart", back_populates="game")
