"""
Time-series table: best-seller rank for a game within a given period
(weekly / monthly / yearly). Data source for this is decided later —
this only defines the structure.
"""

from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class SalesChart(Base):
    __tablename__ = "sales_charts"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False, index=True)

    period_type = Column(String, nullable=False)  # "weekly" | "monthly" | "yearly"
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    rank = Column(Integer, nullable=False)

    recorded_at = Column(DateTime, nullable=False)

    game = relationship("Game", back_populates="sales_chart_entries")
