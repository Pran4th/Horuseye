from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import UserInDB

router = APIRouter()

@router.get("/me")
def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    """
    Fetches the details of the currently authenticated user.
    """
    return {"user_id": current_user.id, "email": current_user.email, "name": current_user.name}