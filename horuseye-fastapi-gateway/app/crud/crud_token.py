from sqlalchemy.orm import Session
from datetime import datetime
from app.schemas.token import InvalidatedToken

def is_token_invalidated(db: Session, token_id: str) -> bool:
    return db.query(InvalidatedToken).filter(InvalidatedToken.id == token_id).first() is not None

def invalidate_token(db: Session, token_id: str, expires_at: datetime):
    db_token = InvalidatedToken(id=token_id, exp=expires_at)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token