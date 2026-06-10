from sqlalchemy import Column, String, DateTime, ForeignKey, func, JSON, Text
# ^-- Import JSON or Text based on your DB support for JSON type
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid
from sqlalchemy.dialects.postgresql import JSONB # Use JSONB for PostgreSQL

class Scan(Base):
    __tablename__ = "Scan"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    target = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    userId = Column(String, ForeignKey("User.id"), nullable=False, index=True)
    # Store configuration as JSONB in Postgres, fallback to Text otherwise
    configuration = Column(JSONB) # Or Column(Text) if JSONB not supported
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    # --- Add server_default here ---
    updatedAt = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User") # Assuming User model is defined elsewhere
    toolExecutions = relationship("ToolExecution", back_populates="scan")

class ToolExecution(Base):
    __tablename__ = "ToolExecution"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    scanId = Column(String, ForeignKey("Scan.id"), nullable=False, index=True)
    toolName = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    # Store parameters as JSONB or Text
    parameters = Column(JSONB) # Or Column(Text)
    startTime = Column(DateTime(timezone=True), nullable=True)
    endTime = Column(DateTime(timezone=True), nullable=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())

    scan = relationship("Scan", back_populates="toolExecutions")
    files = relationship("ScanFile", back_populates="toolExecution")

class ScanFile(Base):
    __tablename__ = "ScanFile"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    # Link to ToolExecution instead of Scan
    toolExecutionId = Column(String, ForeignKey("ToolExecution.id"), nullable=False, index=True)
    fileName = Column(String, nullable=False)
    gcsPath = Column(String, nullable=False, unique=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())

    toolExecution = relationship("ToolExecution", back_populates="files")

# Ensure User schema is imported if not already defined here
# from .user import User # Example import

