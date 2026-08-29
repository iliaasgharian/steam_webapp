"""
User accounts (login is optional site-wide) + user activity tables:
search history, favorite games, favorite genres.
"""

from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)

    username = Column(String, unique=True, nullable=True)
    full_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    country = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)

    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime, nullable=False)
    last_login_at = Column(DateTime, nullable=True)

    search_history = relationship("SearchHistory", back_populates="user")
    favorite_games = relationship("FavoriteGame", back_populates="user")
    favorite_genres = relationship("FavoriteGenre", back_populates="user")


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    search_query = Column(String, nullable=False)
    searched_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="search_history")


class FavoriteGame(Base):
    __tablename__ = "favorite_games"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False, index=True)
    added_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="favorite_games")
    game = relationship("Game")


class FavoriteGenre(Base):
    __tablename__ = "favorite_genres"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    genre_id = Column(Integer, ForeignKey("genres.id"), nullable=False, index=True)

    user = relationship("User", back_populates="favorite_genres")
    genre = relationship("Genre")
