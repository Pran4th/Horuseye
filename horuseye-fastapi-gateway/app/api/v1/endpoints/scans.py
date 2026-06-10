import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import UserInDB
from app.models import scan as scan_models
from app.crud import crud_scan
from app.services import gcs_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get(
    "/", 
    response_model=List[scan_models.ScanBasicResponse],
    summary="Get All Scans for User"
)
def get_scans(
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    """Get a list of all scans initiated by the currently authenticated user."""
    scans = crud_scan.get_scans_by_user(db=db, user_id=current_user.id)
    return scans


@router.get(
    "/{scan_id}/status",
    response_model=scan_models.ScanBasicResponse,
    summary="Get/Refresh Scan Status"
)
def get_scan_status(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    """Fetch the current status of a scan."""
    # --- FIX: Call get_scans_by_user and find the specific scan ---
    # This is complex, but reuses the logic that gets the report count.
    # A more optimized way would be a dedicated CRUD function, but this works.
    scans = crud_scan.get_scans_by_user(db=db, user_id=current_user.id)
    scan = next((s for s in scans if s.id == scan_id), None)
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found or unauthorized.")
    return scan


@router.get(
    "/{scan_id}",
    response_model=scan_models.ScanDetailResponse,
    summary="Get Detailed Scan Information"
)
def get_scan_details(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    """Get all details for a single scan."""
    scan = crud_scan.get_scan_details(db=db, scan_id=scan_id, user_id=current_user.id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found or unauthorized.")
    return scan


@router.delete(
    "/{scan_id}",
    response_model=scan_models.ScanBasicResponse,
    summary="Delete a Scan"
)
def delete_scan(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    """Delete a scan and all its associated data."""
    scan = crud_scan.delete_scan_by_id(db=db, scan_id=scan_id, user_id=current_user.id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found or unauthorized.")
    return scan

# --- FIX: Removed duplicate endpoint ---
@router.get(
    "/{scan_id}/files", 
    response_model=List[scan_models.ScanFileResponse],
    summary="Get Scan Report Files (with Caching)"
)
def get_or_cache_scan_files(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Implements the caching logic.
    1. Checks DB for report files.
    2. If empty, scans GCS, populates DB, and returns results.
    """
    logger.info(f"Fetching files for scan: {scan_id} for user: {current_user.email}")
    
    db_scan = crud_scan.get_scan_by_id(db=db, scan_id=scan_id, user_id=current_user.id)
    if not db_scan:
        logger.warning(f"Access denied or scan not found for {scan_id}")
        raise HTTPException(status_code=404, detail="Scan not found")

    try:
        files = gcs_service.list_and_cache_scan_files(db=db, scan_id=scan_id, user_id=current_user.id)
        return files
    except Exception as e:
        logger.exception(f"Error in file caching logic for scan {scan_id}: {e}")
        if isinstance(e, HTTPException):
            raise e 
        raise HTTPException(status_code=500, detail="Error retrieving scan files.")

# --- FIX: Removed duplicate endpoint ---
@router.post(
    "/files/generate-url", 
    response_model=scan_models.PresignedURLResponse,
    summary="Generate Secure Download URL"
)
def get_presigned_download_url(
    request: scan_models.PresignedURLRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Securely generates a short-lived presigned URL for a given ScanFile ID.
    The user's ownership of the file is verified in the process.
    """
    logger.info(f"Generating signed URL for file: {request.scan_file_id} for user: {current_user.email}")
    try:
        url = gcs_service.generate_signed_url_v4(
            scan_file_id=request.scan_file_id, 
            db=db, 
            user_id=current_user.id
        )
        return scan_models.PresignedURLResponse(url=url)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e 
        logger.exception(f"Failed to generate signed URL for file {request.scan_file_id}: {e}")
        raise HTTPException(status_code=500, detail="Could not generate download URL.")

