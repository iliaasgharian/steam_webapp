"""
Company table (shared by developers & publishers) + its two junction tables.
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

game_developers = Table(
    "game_developers",
    Base.metadata,
    Column("game_id", Integer, ForeignKey("games.id"), primary_key=True),
    Column("company_id", Integer, ForeignKey("companies.id"), primary_key=True),
)

game_publishers = Table(
    "game_publishers",
    Base.metadata,
    Column("game_id", Integer, ForeignKey("games.id"), primary_key=True),
    Column("company_id", Integer, ForeignKey("companies.id"), primary_key=True),
)


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)

    # Extended info — not provided by Steam's API, filled in separately.
    founded_year = Column(Integer, nullable=True)
    country = Column(String, nullable=True)
    headquarters = Column(String, nullable=True)
    website = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=True)

    parent_company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    parent_company = relationship("Company", remote_side=[id], backref="subsidiaries")
