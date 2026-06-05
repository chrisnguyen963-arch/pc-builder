from sqlalchemy import Column, Text, Boolean, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from database import Base

class Category(Base):
    __tablename__ = "categories"
    id       = Column(UUID, primary_key=True)
    name     = Column(Text, nullable=False)
    slug     = Column(Text, nullable=False, unique=True)

class Part(Base):
    __tablename__ = "parts"
    id          = Column(UUID, primary_key=True)
    category_id = Column(UUID, ForeignKey("categories.id"), nullable=False)
    name        = Column(Text, nullable=False)
    brand       = Column(Text, nullable=False)
    model       = Column(Text, nullable=False)
    specs       = Column(JSONB, nullable=False)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(TIMESTAMP, server_default=func.now())

class PriceHistory(Base):
    __tablename__ = "price_history"
    id         = Column(UUID, primary_key=True)
    part_id    = Column(UUID, ForeignKey("parts.id"), nullable=False)
    price      = Column(Numeric(10,2), nullable=False)
    currency   = Column(Text, default="USD")
    source     = Column(Text, nullable=False)
    source_url = Column(Text)
    scraped_at = Column(TIMESTAMP, server_default=func.now())