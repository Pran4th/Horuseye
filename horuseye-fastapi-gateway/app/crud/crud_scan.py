import logging
import datetime
from typing import List
from sqlalchemy.orm import Session, subqueryload
from app.schemas import scan as scan_schema
from app.models import scan as scan_models
from sqlalchemy import func

logger = logging.getLogger(__name__)

# --- (Existing functions: create_scan, create_tool_executions, update_scan_status, update_tool_execution_status) ---
# ... (all your existing functions are correct) ...
def create_scan(db: Session, *, user_id: str, scan_payload: scan_models.FullScanPayloadFrontend) -> scan_schema.Scan:
# ... (existing code) ...
    """Creates a new Scan record in the database."""
    scan_data = scan_payload.data.basicDetails
    db_scan = scan_schema.Scan(
        id=scan_payload.id,
        name=scan_data.scanName,
        target=scan_data.targetValue,
        status="pending",
        userId=user_id,
        configuration=scan_payload.model_dump()
    )
    db.add(db_scan)
    logger.info(f"Prepared Scan record for ID: {db_scan.id}")
    return db_scan

def create_tool_executions(db: Session, *, scan_id: str, tools: list[scan_models.ToolExecutionBackend]) -> list[scan_schema.ToolExecution]:
# ... (existing code) ...
    """Creates ToolExecution records for a given scan."""
    db_tool_executions = []
    
    # --- ADDED: Create placeholder records for the reports ---
    report_tools = [
        {"name": "llm-recon-report", "parameters": []},
        {"name": "llm-vulnr-report", "parameters": []}
    ]
    # --------------------------------------------------------

    for tool_data in tools + report_tools: # Combine tool lists
        db_tool = scan_schema.ToolExecution(
            scanId=scan_id,
            toolName=tool_data['name'],
            status="pending",
            parameters=tool_data.get('parameters', [])
        )
        db_tool_executions.append(db_tool)
        db.add(db_tool)
    logger.info(f"Prepared {len(db_tool_executions)} ToolExecution records for Scan ID: {scan_id}")
    return db_tool_executions

def update_scan_status(db: Session, *, scan_id: str, status: str) -> scan_schema.Scan | None:
# ... (existing code) ...
    """Updates the status of an existing scan."""
    db_scan = db.query(scan_schema.Scan).filter(scan_schema.Scan.id == scan_id).first()
    if db_scan:
        db_scan.status = status
        db_scan.updatedAt = datetime.datetime.now(datetime.timezone.utc)
        db.commit()
        db.refresh(db_scan)
        logger.info(f"Updated Scan {scan_id} status to {status}")
        return db_scan
    else:
        logger.error(f"Scan {scan_id} not found for status update.")
        return None


def update_tool_execution_status(db: Session, *, scan_id: str, tool_name: str, status: str, timestamp: datetime.datetime) -> scan_schema.ToolExecution | None:
# ... (existing code) ...
    """Updates the status and timestamps of a specific tool execution."""
    db_tool_execution = (
        db.query(scan_schema.ToolExecution)
        .filter(scan_schema.ToolExecution.scanId == scan_id)
        .filter(scan_schema.ToolExecution.toolName == tool_name)
        .first()
    )
    if db_tool_execution:
        db_tool_execution.status = status
        if status.lower() == "running":
            db_tool_execution.startTime = timestamp
        elif status.lower() in ["completed", "failed"]:
            db_tool_execution.endTime = timestamp
        db.commit()
        db.refresh(db_tool_execution)
        logger.info(f"Updated ToolExecution {tool_name} for Scan {scan_id} to status {status}")
        return db_tool_execution
    else:
        logger.error(f"ToolExecution {tool_name} for Scan {scan_id} not found for status update.")
        return None


def get_scan_by_id(db: Session, *, scan_id: str, user_id: str) -> scan_schema.Scan | None:
# ... (existing code) ...
    """
    Fetches a single scan by its ID, ensuring it belongs to the user.
    This version preloads the tool executions.
    """
    return db.query(scan_schema.Scan)\
        .options(subqueryload(scan_schema.Scan.toolExecutions))\
        .filter(scan_schema.Scan.id == scan_id)\
        .filter(scan_schema.Scan.userId == user_id)\
        .first()

def get_scans_by_user(db: Session, *, user_id: str, skip: int = 0, limit: int = 100) -> List[scan_schema.Scan]:
# ... (existing code) ...
    """
    Fetches all scans for a specific user, joining with ToolExecution and ScanFile
    to calculate the report count.
    """
    # Define the tool names that correspond to reports
    report_tool_names = ('llm-recon-report', 'llm-vulnr-report')
    
    # Subquery to count files linked to report tool executions
    file_count_subquery = (
        db.query(
            scan_schema.ToolExecution.scanId,
            func.count(scan_schema.ScanFile.id).label("report_count")
        )
        .join(scan_schema.ScanFile, scan_schema.ScanFile.toolExecutionId == scan_schema.ToolExecution.id)
        .filter(scan_schema.ToolExecution.toolName.in_(report_tool_names))
        .group_by(scan_schema.ToolExecution.scanId)
        .subquery()
    )

    # Main query
    query = (
        db.query(
            scan_schema.Scan,
            # Use coalesce to turn NULL counts into 0
            func.coalesce(file_count_subquery.c.report_count, 0).label("report_count")
        )
        .outerjoin(file_count_subquery, scan_schema.Scan.id == file_count_subquery.c.scanId)
        .filter(scan_schema.Scan.userId == user_id)
        .order_by(scan_schema.Scan.createdAt.desc())
        .offset(skip)
        .limit(limit)
    )
    
    # Execute and map results
    scan_results_with_counts = query.all()
    
    # Map the (Scan, report_count) tuples to Scan objects with the count
    scans = []
    for scan, count in scan_results_with_counts:
        scan.reportCount = count # Attach the count to the ORM object
        scans.append(scan)
        
    return scans


def get_scan_basic_info(db: Session, *, scan_id: str, user_id: str) -> scan_schema.Scan | None:
# ... (existing code) ...
    """Fetch only basic scan info (id, name, target, status)."""
    return (
        db.query(scan_schema.Scan)
        .filter(scan_schema.Scan.id == scan_id)
        .filter(scan_schema.Scan.userId == user_id)
        .first()
    )


def get_scan_details(db: Session, *, scan_id: str, user_id: str) -> scan_schema.Scan | None:
# ... (existing code) ...
    """Fetch detailed scan info including related tool executions."""
    return (
        db.query(scan_schema.Scan)
        .filter(scan_schema.Scan.id == scan_id)
        .filter(scan_schema.Scan.userId == user_id)
        .first()
    )


def delete_scan_by_id(db: Session, *, scan_id: str, user_id: str) -> scan_schema.Scan | None:
# ... (existing code) ...
    """Deletes a scan by its ID, ensuring it belongs to the user."""
    db_scan = get_scan_by_id(db=db, scan_id=scan_id, user_id=user_id)
    if db_scan:
        db.delete(db_scan)
        db.commit()
        logger.info(f"Deleted Scan {scan_id} for user {user_id}")
        return db_scan
    return None

def get_tool_executions_for_scan(db: Session, *, user_id: str, scan_id: str) -> List[scan_schema.ToolExecution]:
# ... (existing code) ...
    """
    Fetches all ToolExecution records for a scan, ensuring user ownership
    by joining on the parent Scan.
    """
    return (
        db.query(scan_schema.ToolExecution)
        .join(
            scan_schema.Scan,
            scan_schema.ToolExecution.scanId == scan_schema.Scan.id,
        )
        .filter(scan_schema.Scan.id == scan_id)
        .filter(scan_schema.Scan.userId == user_id)
        .all()
    )
    
def get_tool_execution_id_map(db: Session, *, scan_id: str) -> dict[str, str]:
# ... (existing code) ...
    """
    Fetches all ToolExecution records for a scan and returns a map of
    {toolName: toolExecutionId}
    """
    tool_executions = db.query(scan_schema.ToolExecution)\
        .filter(scan_schema.ToolExecution.scanId == scan_id)\
        .all()
    
    return {tool.toolName: tool.id for tool in tool_executions}

def get_files_by_scan_id(db: Session, *, scan_id: str) -> List[scan_schema.ScanFile]:
# ... (existing code) ...
    """Fetches all ScanFile records for a given scan."""
    return db.query(scan_schema.ScanFile)\
        .join(scan_schema.ToolExecution)\
        .filter(scan_schema.ToolExecution.scanId == scan_id)\
        .all()

def create_scan_files(db: Session, *, files_to_create: List[dict]) -> List[scan_schema.ScanFile]:
# ... (existing code) ...
    """Bulk creates ScanFile records."""
    db_files = [scan_schema.ScanFile(**file_data) for file_data in files_to_create]
    db.add_all(db_files)
    db.commit()
    for db_file in db_files:
        db.refresh(db_file)
    return db_files

# --- FIX 1: Renamed 'id' to 'scan_file_id' to match what's being called ---
def get_scan_file_by_id(db: Session, *, scan_file_id: str, user_id: str) -> scan_schema.ScanFile | None:
    """
    Fetches a single ScanFile by its ID, ensuring it belongs to the user
    by joining through Scan and ToolExecution.
    """
    return db.query(scan_schema.ScanFile)\
        .join(scan_schema.ToolExecution, scan_schema.ScanFile.toolExecutionId == scan_schema.ToolExecution.id)\
        .join(scan_schema.Scan, scan_schema.ToolExecution.scanId == scan_schema.Scan.id)\
        .filter(scan_schema.Scan.userId == user_id)\
        .filter(scan_schema.ScanFile.id == scan_file_id)\
        .first()

# --- FIX 2: Add the missing function that gcs_service.py is calling ---
def get_files_by_scan_id_and_tool_names(db: Session, *, scan_id: str, tool_names: List[str]) -> List[scan_schema.ScanFile]:
    """Fetches scan files for a specific scan, filtered by a list of tool names."""
    return db.query(scan_schema.ScanFile)\
        .join(scan_schema.ToolExecution, scan_schema.ScanFile.toolExecutionId == scan_schema.ToolExecution.id)\
        .filter(scan_schema.ToolExecution.scanId == scan_id)\
        .filter(scan_schema.ToolExecution.toolName.in_(tool_names))\
        .all()

