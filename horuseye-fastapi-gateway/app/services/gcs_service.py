import logging
import re
import os
from datetime import timedelta
from google.cloud import storage
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas import scan as scan_model

from app.crud import crud_scan
from app.schemas import scan as scan_schema
from app.core.config import settings

logger = logging.getLogger(__name__)

# Ensure GCS_DATA_BUCKET is loaded from settings
GCS_DATA_BUCKET = os.environ.get("GCS_DATA_BUCKET")

def list_and_cache_scan_files(db: Session, scan_id: str, user_id: str) -> list[scan_schema.ScanFile]:
    logger.info(f"Starting file cache process for scan_id: {scan_id}")

    report_tool_names = ["llm-recon-report", "llm-vulnr-report"]
    existing_files = crud_scan.get_files_by_scan_id_and_tool_names(
        db=db, scan_id=scan_id, tool_names=report_tool_names
    )
    if existing_files:
        logger.info(f"Cache hit: Found {len(existing_files)} report files for {scan_id}")
        return existing_files

    storage_client = storage.Client()
    prefix = f"data/{scan_id}/reports/"
    try:
        blobs = storage_client.list_blobs(GCS_DATA_BUCKET, prefix=prefix)
    except Exception as e:
        logger.error(f"GCS list failed for prefix {prefix}: {e}")
        raise HTTPException(status_code=500, detail="Could not connect to GCS")

    expected_files = {
        f"data/{scan_id}/reports/llm-recon-report.pdf": "llm-recon-report",
        f"data/{scan_id}/reports/llm-vulnr-report.pdf": "llm-vulnr-report",
    }

    # Load current executions
    tool_executions = crud_scan.get_tool_executions_for_scan(db=db, scan_id=scan_id, user_id=user_id)
    tool_map = {tool.toolName: tool.id for tool in tool_executions}

    new_db_files = []

    for blob in blobs:
        if blob.name.endswith("/"):
            continue

        if blob.name not in expected_files:
            continue

        llm_tool_name = expected_files[blob.name]
        tool_execution_id = tool_map.get(llm_tool_name)

        # ✅ If missing, create a placeholder ToolExecution
        if not tool_execution_id:
            logger.warning(f"⚠️ No ToolExecution found for {llm_tool_name}. Creating placeholder.")
            placeholder = scan_model.ToolExecution(
                scanId=scan_id,
                toolName=llm_tool_name,
                status="completed",
                parameters={},
            )
            db.add(placeholder)
            db.commit()
            db.refresh(placeholder)
            tool_execution_id = placeholder.id
            tool_map[llm_tool_name] = tool_execution_id

        file_name = blob.name.split("/")[-1]
        db_file = scan_schema.ScanFile(
            toolExecutionId=tool_execution_id,
            fileName=file_name,
            gcsPath=f"gs://{GCS_DATA_BUCKET}/{blob.name}",
        )
        db.add(db_file)
        new_db_files.append(db_file)
        logger.info(f"✅ Cached {file_name} for tool {llm_tool_name}")

    try:
        if new_db_files:
            db.commit()
            for db_file in new_db_files:
                db.refresh(db_file)
            logger.info(f"Successfully cached {len(new_db_files)} new files for {scan_id}")
        else:
            logger.warning(f"No report files found for scan_id={scan_id}")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to commit new scan files: {e}")
        return []

    return new_db_files

def generate_signed_url_v4(scan_file_id: str, db: Session, user_id: str) -> str:
    """
    Generates a secure, short-lived (15 min) download URL for a file.
    """
    logger.info(f"Generating signed URL for ScanFile ID: {scan_file_id}")

    # 1. Get file metadata from our DB, checking user ownership
    # --- FIX: Call with 'scan_file_id' to match the updated CRUD function ---
    db_file = crud_scan.get_scan_file_by_id(db=db, scan_file_id=scan_file_id, user_id=user_id)
    
    if not db_file:
        logger.error(f"Attempt to access unauthorized or non-existent file ID: {scan_file_id} by user: {user_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found or access denied.")

    # 2. Parse GCS path
    try:
        if not db_file.gcsPath.startswith("gs://"):
            raise ValueError("Invalid GCS path format.")
        
        path_parts = db_file.gcsPath.replace("gs://", "").split("/", 1)
        bucket_name = path_parts[0]
        blob_name = path_parts[1]
    except Exception as e:
        logger.error(f"Invalid gcsPath for file ID {scan_file_id}: {db_file.gcsPath} - {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal file path configuration error.")

    # 3. Generate the signed URL
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)

        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=15),
            method="GET",
        )
        logger.info(f"Successfully generated signed URL for file ID: {scan_file_id}")
        return url
        
    except Exception as e:
        logger.exception(f"Failed to generate signed URL for blob: {blob_name} - {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not generate download URL.")

