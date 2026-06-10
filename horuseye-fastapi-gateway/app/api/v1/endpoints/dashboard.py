import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import UserInDB
from app.models import dashboard as dashboard_models
from app.crud import crud_dashboard

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get(
    "/stats",
    response_model=dashboard_models.DashboardStatsResponse,
    summary="Get All Dashboard Statistics"
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Get all aggregated statistics for the dashboard for the
    currently authenticated user.
    """
    logger.info(f"Fetching dashboard stats for user: {current_user.email}")
    try:
        stats = crud_dashboard.get_dashboard_stats(db=db, user_id=current_user.id)
        return stats
    except Exception as e:
        logger.exception(f"Error fetching dashboard stats for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching dashboard data.")
