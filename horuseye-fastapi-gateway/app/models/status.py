from pydantic import BaseModel
import datetime

# Defines the status for a Scan
# ScanStatus = Literal["pending", "submitted", "recon_running", "recon_complete", "vuln_running", "vuln_complete", "reports_running", "reports_complete", "failed"]

# Defines the status for a single Tool
# ToolStatus = Literal["pending", "running", "completed", "failed"]

class ScanStatusUpdate(BaseModel):
    scan_id: str
    status: str # Changed to str for simplicity

class ToolStatusUpdate(BaseModel):
    scan_id: str
    tool_name: str
    status: str # Changed to str for simplicity
    timestamp: datetime.datetime = datetime.datetime.now(datetime.timezone.utc)

