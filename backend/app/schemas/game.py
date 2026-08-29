"""
Pydantic schemas for the Game resource and its lookups.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class GenreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    description: str


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    description: str


class GameListItem(BaseModel):
    """Slim representation used in list/search results."""
    model_config = ConfigDict(from_attributes=True)
    appid: int
    name: str
    header_image: Optional[str] = None
    price_final: Optional[int] = None
    is_free: bool = False
    genres: list[str] = []


class GameListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    results: list[GameListItem]


class PlatformsOut(BaseModel):
    windows: bool
    mac: bool
    linux: bool


class GameDetail(BaseModel):
    """Full game detail response."""
    model_config = ConfigDict(from_attributes=True)
    appid: int
    name: str
    type: Optional[str] = None
    is_free: bool = False
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    header_image: Optional[str] = None
    release_date: Optional[str] = None
    is_released: bool = True
    price_initial: Optional[int] = None
    price_final: Optional[int] = None
    discount_percent: Optional[int] = None
    currency: Optional[str] = None
    metacritic_score: Optional[int] = None
    positive_reviews: Optional[int] = None
    negative_reviews: Optional[int] = None
    genres: list[str] = []
    categories: list[str] = []
    developers: list[str] = []
    publishers: list[str] = []
    screenshots: list[str] = []
    movies: list[str] = []


class PlayerSnapshotOut(BaseModel):
    recorded_at: datetime
    player_count: int


class PlayerHistoryResponse(BaseModel):
    appid: int
    range: str
    data: list[PlayerSnapshotOut]
