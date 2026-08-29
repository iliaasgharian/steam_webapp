"""
Pydantic schemas for the sales charts (best-seller rankings).
"""

from datetime import date
from pydantic import BaseModel


class SalesChartEntry(BaseModel):
    rank: int
    appid: int
    name: str


class SalesChartResponse(BaseModel):
    period_type: str
    period_start: date
    period_end: date
    rankings: list[SalesChartEntry]
