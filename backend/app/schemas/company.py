"""
Pydantic schemas for the Company resource.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class CompanyListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    country: Optional[str] = None
    founded_year: Optional[int] = None


class CompanyListResponse(BaseModel):
    total: int
    results: list[CompanyListItem]


class CompanyGameItem(BaseModel):
    appid: int
    name: str


class CompanyDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    founded_year: Optional[int] = None
    country: Optional[str] = None
    headquarters: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    developed_games: list[CompanyGameItem] = []
    published_games: list[CompanyGameItem] = []
