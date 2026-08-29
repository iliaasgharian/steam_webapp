"""
Time-series table: a live player-count reading for a game at a point in time.
This table grows continuously as the update script runs periodically.
"""

from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class PlayerSnapshot(Base):
    __tablename__ = "player_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False, index=True)
    player_count = Column(Integer, nullable=False)
    recorded_at = Column(DateTime, nullable=False)

    game = relationship("Game", back_populates="player_snapshots")
