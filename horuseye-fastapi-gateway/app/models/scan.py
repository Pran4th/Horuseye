from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import datetime # <-- Import datetime

# --- 1. FRONTEND PAYLOAD MODELS (Unchanged) ---
# (Existing models: ToolParamsFrontend, ToolExecutionFrontend, ReconDataFrontend, 
# VulnrDataFrontend, ExploitDataFrontend, BasicDetailsFrontend, ROEFrontend, 
# ScanDataFrontend, FullScanPayloadFrontend)

class ToolParamsFrontend(BaseModel):
    pass

class ToolExecutionFrontend(BaseModel):
    name: str
    enabled: bool
    parameters: Dict[str, str] = Field(default_factory=dict)
    generated_command: Optional[str] = None

class ReconDataFrontend(BaseModel):
    reconTools: List[ToolExecutionFrontend] = Field(default_factory=list)

class VulnrDataFrontend(BaseModel):
    vulnrTools: List[ToolExecutionFrontend] = Field(default_factory=list)

class ExploitDataFrontend(BaseModel):
    attemptExploitation: bool = False
    exploitTools: List[ToolExecutionFrontend] = Field(default_factory=list)

class BasicDetailsFrontend(BaseModel):
    targetType: str
    targetValue: str
    scanName: str
    description: Optional[str] = None
    scanIntensity: str
    scanSchedule: str
    maxDuration: Optional[str] = None
    notifyOnCompletion: bool = False
    generateReport: bool = False
    saveConfiguration: bool = False

class ROEFrontend(BaseModel):
    rulesOfEngagementStatement: str

class ScanDataFrontend(BaseModel):
    basicDetails: BasicDetailsFrontend
    roe: ROEFrontend
    recon: ReconDataFrontend
    vulnr: VulnrDataFrontend
    exploit: ExploitDataFrontend

class FullScanPayloadFrontend(BaseModel):
    id: str
    createdAt: float
    data: ScanDataFrontend


# --- 2. BACKEND/WORKER MODELS (Unchanged) ---
# (Existing models: ToolParameterBackend, ToolExecutionBackend)

class ToolParameterBackend(BaseModel):
    flag: str
    value: Optional[str] = None
    requiresValue: Optional[bool] = False

class ToolExecutionBackend(BaseModel):
    name: str
    parameters: List[Dict[str, Any]]


# --- 3. API RESPONSE MODELS (FIXED) ---

class ScanBasicResponse(BaseModel):
    """
    For the list of scans and status refresh.
    Fields: id, name, target, status, createdAt
    """
    id: str
    name: str
    target: str
    status: str
    createdAt: datetime.datetime
    reportCount: int = 0  

    class Config:
        from_attributes = True

# --- FIX: This model now *only* contains the fields you requested ---
class ToolExecutionResponse(BaseModel):
    """
    Detailed info for a single tool execution.
    Fields: toolName, status, parameters, startTime, endTime
    """
    toolName: str
    status: str
    parameters: Any # Will be the JSON parameters
    startTime: Optional[datetime.datetime] = None
    endTime: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class ScanDetailResponse(BaseModel):
    """
    The full, detailed response for a single scan.
    """
    id: str
    name: str
    target: str
    status: str
    createdAt: datetime.datetime
    configuration: Any # Will be the full JSON config
    # This list will now use the selective ToolExecutionResponse
    toolExecutions: List[ToolExecutionResponse] = []

    class Config:
        from_attributes = True

class ScanFileResponse(BaseModel):
    """Response model for a single cached file record."""
    id: str
    toolExecutionId: str
    fileName: str
    gcsPath: str
    createdAt: datetime.datetime

    class Config:
        from_attributes = True

class PresignedURLRequest(BaseModel):
    """Request body to get a presigned URL."""
    scan_file_id: str

class PresignedURLResponse(BaseModel):
    """Response body containing the presigned URL."""
    url: str

