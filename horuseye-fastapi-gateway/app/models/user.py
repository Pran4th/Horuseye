from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class GoogleLoginRequest(BaseModel):
    token: str 

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    image: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserInDB(UserBase):
    id: str
    class Config:
        from_attributes = True