from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from google.oauth2 import id_token
from google.auth.transport import requests

from jose import JWTError, jwt
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, get_current_user
from app.crud import crud_user, crud_token
from app.db.session import get_db
from app.models.user import GoogleLoginRequest, Token, UserCreate, UserInDB
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

@router.post("/refresh", response_model=Token)
def refresh_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        token_jti: str = payload.get("jti") 

        if user_id is None or token_jti is None:
            raise credentials_exception

        if crud_token.is_token_invalidated(db, token_id=token_jti):
            raise credentials_exception

    except JWTError:
        raise credentials_exception
    
    user = crud_user.get_user(db, user_id=user_id)
    if user is None:
        raise credentials_exception

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    new_refresh_token = create_refresh_token(data={"sub": user.id})

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/google/login", response_model=Token)
def login_with_google(request_body: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            request_body.token, requests.Request(), settings.GOOGLE_CLIENT_ID
        )
        email = idinfo["email"]
        name = idinfo.get("name")
        picture = idinfo.get("picture")

    except ValueError as e:
        print("Google token verification error:", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}",
        )

    user = crud_user.get_user_by_email(db, email=email)
    
    if not user:
        user_in = UserCreate(email=email, name=name, image=picture)
        user = crud_user.create_user(db, user=user_in)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.id})
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM], options={"verify_exp": False})
        token_jti: str = payload.get("jti")
        token_exp = datetime.fromtimestamp(payload.get("exp"))
        
        if token_jti:
            crud_token.invalidate_token(db, token_id=token_jti, expires_at=token_exp)
            
    except JWTError:
        # If token is invalid anyway, we don't need to do anything
        pass
        
    return {"message": "Successfully logged out"}
