from pydantic import BaseModel
from typing import List, Optional
import datetime

class KpiStats(BaseModel):
    """Key Performance Indicators for the main stat cards."""
    total_scans: int
    scans_today: int
    avg_scan_time_seconds: Optional[float] = None
    total_reports_generated: int

class ScansOverTime(BaseModel):
    """Data for the 'Scans in Last 7 Days' bar chart."""
    date: str  # Using string for YYYY-MM-DD
    count: int

class StatusBreakdown(BaseModel):
    """Data for the 'Scan Status Breakdown' pie chart."""
    status: str
    count: int
    
    class Config:
        from_attributes = True

class DashboardStatsResponse(BaseModel):
    """The all-in-one response model for the dashboard."""
    kpis: KpiStats
    scans_last_7_days: List[ScansOverTime]
    status_breakdown: List[StatusBreakdown]
