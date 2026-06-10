from sqlalchemy import Column, String, DateTime, func
from app.db.base import Base 
class User(Base):
    __tablename__ = "User"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    image = Column(String, nullable=True)
