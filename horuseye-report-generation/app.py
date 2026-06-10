import os
import posixpath
import logging
from dotenv import load_dotenv

from utils.gcs_utils import list_and_read_llm_files, save_bytes_to_gcs
from utils.vertex_utils import generate_security_report
from utils.pdf_utils import create_pdf_report

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LLMReportLogic")

# Load environment variables for local testing (Argo will provide these in production)
load_dotenv()

PROJECT_ID = os.environ.get('GCP_PROJECT_ID')
LOCATION = os.environ.get('GCP_LOCATION')
INPUT_BUCKET = os.environ.get('DEFAULT_INPUT_BUCKET')
OUTPUT_BUCKET = os.environ.get('DEFAULT_OUTPUT_BUCKET')

def execute_report_generation(scanid: str, report_type: str):
    """
    This is the core logic, refactored from the Flask app.
    It's now callable by the Argo worker script.
    """
    logger.info(f"--- Starting Report Generation for Scan ID: {scanid}, Type: {report_type} ---")
    
    if not all([PROJECT_ID, LOCATION, INPUT_BUCKET, OUTPUT_BUCKET]):
        logger.error("FATAL ERROR: Missing one or more required GCS/Vertex environment variables.")
        raise EnvironmentError("Missing GCS/Vertex environment variables")

    # --- 1. Construct Paths ---
    logger.info("Constructing GCS paths...")
    try:
        # Input path, e.g., "data/scan-id/recon/"
        base_folder_blob = posixpath.join("data", scanid, report_type) + "/"
        
        # Output directory, e.g., "data/scan-id/reports/"
        report_save_dir = posixpath.join("data", scanid, "reports")
        
        # Output filename, e.g., "scan-id_recon_report.pdf"
        report_filename = f"llm-{report_type}-report.pdf"
        
        # Full output blob path
        output_blob = posixpath.join(report_save_dir, report_filename)
        
        logger.info(f"Input GCS path: gs://{INPUT_BUCKET}/{base_folder_blob}")
        logger.info(f"Output GCS path: gs://{OUTPUT_BUCKET}/{output_blob}")

    except Exception as e:
        logger.error(f"Error parsing path: {e}")
        raise ValueError(f"Invalid 'scanid' or 'type' format: {e}")

    # --- 2. List and Read Files from GCS ---
    logger.info("Listing and reading tool output files from GCS...")
    compiled_text, service_names, error = list_and_read_llm_files(INPUT_BUCKET, base_folder_blob)
    if error:
        logger.error(f"GCS Read Error: {error}")
        raise Exception(f"GCS Read Error: {error}")
    
    logger.info(f"Successfully compiled text from {len(service_names)} services.")

    # --- 3. Generate Report with Vertex AI ---
    logger.info("Generating security insights with Vertex AI...")
    report_dict, error = generate_security_report(PROJECT_ID, LOCATION, compiled_text)
    if error:
        logger.error(f"Vertex AI Error: {error}")
        raise Exception(f"Vertex AI Error: {error}")
    
    logger.info("Successfully generated report data from Vertex AI.")

    # --- 4. Create PDF ---
    logger.info("Creating PDF document...")
    pdf_bytes = create_pdf_report(report_dict, report_type)
    logger.info("PDF document created in memory.")

    # --- 5. Save PDF to GCS ---
    logger.info(f"Saving PDF to GCS at gs://{OUTPUT_BUCKET}/{output_blob}...")
    saved, error = save_bytes_to_gcs(OUTPUT_BUCKET, output_blob, pdf_bytes, 'application/pdf')
    if not saved:
        logger.error(f"GCS Write Error: {error}")
        raise Exception(f"GCS Write Error: {error}")
    
    logger.info(f"--- Report Generation Complete for Scan ID: {scanid} ---")
    
    # Return a success dictionary (optional, but good for logging)
    return {
        "status": "success",
        "scanid": scanid,
        "report_type": report_type,
        "included_services": service_names,
        "report_location_gcs": f"gs://{OUTPUT_BUCKET}/{output_blob}"
    }

# This allows the file to be run directly for testing, 
# but it won't be called by Argo.
if __name__ == '__main__':
    logger.info("Running in __main__ for local testing...")
    # You can add test values here
    # test_scan_id = "your-test-scan-id"
    # test_report_type = "recon"
    # execute_report_generation(test_scan_id, test_report_type)
    pass
