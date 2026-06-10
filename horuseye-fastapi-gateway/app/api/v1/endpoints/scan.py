import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError 
from app.core.security import get_current_user
from app.db.session import get_db
from app.models.scan import FullScanPayloadFrontend, ToolExecutionBackend
from app.models.user import UserInDB
from app.services.argo_service import submit_argo_workflow, transform_frontend_params_to_backend
from app.crud import crud_scan

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/start", status_code=status.HTTP_202_ACCEPTED)
def start_scan(
    scan_payload: FullScanPayloadFrontend,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user) # Ensure user is authenticated
):
    """
    Receives scan configuration from the frontend and triggers the Argo workflow.
    """
    logger.info(f"Received scan request payload ID: {scan_payload.id} from user: {current_user.email}")
    
    scan_id = scan_payload.id 
    target = scan_payload.data.basicDetails.targetValue

    try:
        recon_tools_backend = []
        for tool in scan_payload.data.recon.reconTools:
            if tool.enabled:
                recon_tools_backend.append(
                    ToolExecutionBackend(
                        name=tool.name,
                        parameters=transform_frontend_params_to_backend(tool.parameters)
                    ).model_dump() 
                )
        
        vulnr_tools_backend = []
        for tool in scan_payload.data.vulnr.vulnrTools:
             if tool.enabled:
                vulnr_tools_backend.append(
                    ToolExecutionBackend(
                        name=tool.name,
                        parameters=transform_frontend_params_to_backend(tool.parameters)
                    ).model_dump() 
                )

        if not recon_tools_backend:
             raise ValueError("No reconnaissance tools were enabled or provided.")
             
    except Exception as e:
        logger.error(f"Error transforming tool parameters for scan {scan_id}: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid tool configuration: {e}") from e

    db_scan = None # Initialize to None
    try:
        db_scan = crud_scan.create_scan(db=db, user_id=current_user.id, scan_payload=scan_payload)

        all_tools_for_db = recon_tools_backend + vulnr_tools_backend
        crud_scan.create_tool_executions(db=db, scan_id=db_scan.id, tools=all_tools_for_db)

        db.commit()
        db.refresh(db_scan) 
        logger.info(f"Successfully saved initial Scan and ToolExecution records for Scan ID: {scan_id}")

    except SQLAlchemyError as e:
        db.rollback() 
        logger.exception(f"Database error saving scan metadata for {scan_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to save scan configuration.")
    except Exception as e: 
        db.rollback()
        logger.exception(f"Unexpected error saving scan metadata for {scan_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to save scan configuration.")

    try:
        result = submit_argo_workflow(
            scan_id=scan_id,
            target=target,
            recon_tools=recon_tools_backend, 
            vulnr_tools=vulnr_tools_backend 
        )
        crud_scan.update_scan_status(db=db, scan_id=scan_id, status="submitted")
        return {"message": "Scan submitted successfully", "scan_id": scan_id, "workflow_name": result.get("workflow_name")}

    except HTTPException as http_exc:
        if db_scan: 
            crud_scan.update_scan_status(db=db, scan_id=scan_id, status="failed")
        raise http_exc 
    except Exception as e:
        if db_scan:
            crud_scan.update_scan_status(db=db, scan_id=scan_id, status="failed")
        logger.exception(f"Unexpected error triggering workflow for scan {scan_id}")
        raise HTTPException(status_code=500, detail="Failed to start scan workflow.")