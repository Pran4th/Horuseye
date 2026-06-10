import uuid
from sqlalchemy.orm import Session
from app.schemas.user import User
from app.models.user import UserCreate

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        id=str(uuid.uuid4()),  
        email=user.email,
        name=user.name,
        image=user.image
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user