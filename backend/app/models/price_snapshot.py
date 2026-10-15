"""Historical store price observations for SteamDB-style charts."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class PriceSnapshot(Base):
    __tablename__ = "price_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False, index=True)
    price_initial = Column(Integer, nullable=True)  # cents
    price_final = Column(Integer, nullable=True)    # cents
    discount_percent = Column(Integer, nullable=True)
    currency = Column(String, nullable=True)
    recorded_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    game = relationship("Game", back_populates="price_snapshots")
    __table_args__ = (Index("ix_price_snapshots_game_recorded", "game_id", "recorded_at"),)
