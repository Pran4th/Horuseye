import os
import sys
import logging
import json
import requests 
import datetime 
from functools import partial 

from app import execute_report_generation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ArgoWorker-LLM")

FASTAPI_INTERNAL_URL = "http://fastapi-gateway-svc.default.svc.cluster.local:80/api/v1/internal"

def update_tool_status(scan_id: str, tool_name: str, status: str):
    """Calls the internal FastAPI endpoint to update a specific ToolExecution status."""
    try:
        payload = {
            "scan_id": scan_id,
            "tool_name": tool_name,
            "status": status,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        response = requests.post(f"{FASTAPI_INTERNAL_URL}/tool/status", json=payload, timeout=5)
        response.raise_for_status()
        logger.info(f"Successfully updated Tool {tool_name} for Scan {scan_id} to {status}")
    except requests.exceptions.RequestException as e:
        # Log the error but don't fail the workflow, as the report itself might have generated
        logger.error(f"Failed to update Tool {tool_name} status to {status} for {scan_id}: {e}")

def update_scan_status(scan_id: str, status: str):
    """Calls the internal FastAPI endpoint to update the overall Scan status."""
    try:
        payload = {"scan_id": scan_id, "status": status}
        response = requests.post(f"{FASTAPI_INTERNAL_URL}/scan/status", json=payload, timeout=5)
        response.raise_for_status() 
        logger.info(f"Successfully updated Scan {scan_id} status to {status}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to update Scan status to {status} for {scan_id}: {e}")

def main():
    logger.info("--- Argo Report Worker Entrypoint ---")

    try:
        scan_id = os.environ['SCAN_ID']
        
        report_type = os.environ['REPORT_TYPE'].strip('\"') # "recon" -> recon
        
        os.environ['GCP_PROJECT_ID'] = os.environ['GCP_PROJECT_ID']
        os.environ['GCP_LOCATION'] = os.environ['GCP_LOCATION']
        os.environ['DEFAULT_INPUT_BUCKET'] = os.environ['GCS_INPUT_BUCKET']
        os.environ['DEFAULT_OUTPUT_BUCKET'] = os.environ['GCS_OUTPUT_BUCKET']
        
        tool_name = f"llm-{report_type}-report"

        logger.info(f"Processing report for Scan ID: {scan_id}, Type: {report_type}")

    except KeyError as e:
        logger.error(f"FATAL: Missing environment variable: {e}")
        sys.exit(1)

    try:
        # --- NEW: Report 'running' status ---
        update_tool_status(scan_id, tool_name, "running")
        
        # 2. Call the main reporting logic
        result = execute_report_generation(scan_id, report_type)
        
        logger.info(f"Successfully generated report: {json.dumps(result, indent=2)}")

        # --- NEW: Report 'completed' status ---
        update_tool_status(scan_id, tool_name, "completed")
        
        # --- NEW: Update overall scan status ---
        # This is a simple way to show progress.
        # We'll need a more robust way to check if *both* reports are done.
        if report_type == "recon":
            update_scan_status(scan_id, "recon_report_complete")
        elif report_type == "vulnr":
            update_scan_status(scan_id, "vuln_report_complete") # Or "completed"

        logger.info("--- Argo Worker Complete ---")
        sys.exit(0) # Exit with success code

    except Exception as e:
        logger.exception(f"Report generation failed with a critical error: {e}")
        
        # --- NEW: Report 'failed' status ---
        update_tool_status(scan_id, tool_name, "failed")
        update_scan_status(scan_id, "failed") # Mark the whole scan as failed

        logger.info("--- Argo Worker Failed ---")
        sys.exit(1) # Exit with failure code

if __name__ == "__main__":
    main()
