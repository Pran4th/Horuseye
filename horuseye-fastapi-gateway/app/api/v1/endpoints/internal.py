import logging
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.status import ScanStatusUpdate, ToolStatusUpdate
from app.crud import crud_scan
from sqlalchemy.exc import SQLAlchemyError

# In a production setup, you would lock this down,
# e.g., by checking for a specific internal header,
# or only allowing requests from cluster-internal IPs.
# For now, we will allow it to be called by any service inside the cluster.

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/scan/status", status_code=status.HTTP_200_OK)
def update_scan_status(
    status_update: ScanStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    An internal endpoint for worker pods or sensors to report high-level
    scan status changes (e.g., "recon_complete", "reports_generated").
    """
    logger.info(f"Internal request to update scan {status_update.scan_id} to status {status_update.status}")
    try:
        db_scan = crud_scan.update_scan_status(
            db=db,
            scan_id=status_update.scan_id,
            status=status_update.status
        )
        if not db_scan:
            raise HTTPException(status_code=404, detail="Scan not found")
        
        return {"message": "Scan status updated", "scan_id": db_scan.id, "new_status": db_scan.status}
    
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Internal DB error updating scan status: {e}")
        raise HTTPException(status_code=500, detail="Database error")

@router.post("/tool/status", status_code=status.HTTP_200_OK)
def update_tool_status(
    status_update: ToolStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    An internal endpoint for worker pods to report their own status
    (e.g., "running", "completed").
    """
    logger.info(f"Internal request to update tool {status_update.tool_name} for scan {status_update.scan_id} to {status_update.status}")
    try:
        db_tool = crud_scan.update_tool_execution_status(
            db=db,
            scan_id=status_update.scan_id,
            tool_name=status_update.tool_name,
            status=status_update.status,
            timestamp=status_update.timestamp
        )
        if not db_tool:
            raise HTTPException(status_code=404, detail="Tool execution not found")

        return {"message": "Tool status updated", "tool_id": db_tool.id, "new_status": db_tool.status}
    
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Internal DB error updating tool status: {e}")
        raise HTTPException(status_code=500, detail="Database error")

