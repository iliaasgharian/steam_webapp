"""
Pydantic schemas for User profile, search history, and favorites.
"""

from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    country: Optional[str] = None
    created_at: datetime


class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    country: Optional[str] = None
    date_of_birth: Optional[date] = None


class SearchHistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    search_query: str
    searched_at: datetime


class FavoriteGameOut(BaseModel):
    appid: int
    name: str
    added_at: datetime


class FavoriteGameCreate(BaseModel):
    appid: int


class FavoriteGenreOut(BaseModel):
    id: int
    description: str


class FavoriteGenreCreate(BaseModel):
    genre_id: int
