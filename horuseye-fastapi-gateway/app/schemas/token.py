from sqlalchemy import Column, String, DateTime
from app.db.base import Base 

class InvalidatedToken(Base):
    __tablename__ = "Invalidated_tokens"

    id = Column(String, primary_key=True, index=True)
    exp = Column(DateTime, nullable=False)