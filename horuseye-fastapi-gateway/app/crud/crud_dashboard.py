import logging
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date, Interval
from app.schemas import scan as scan_schema
from app.models import dashboard as dashboard_models
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def get_dashboard_stats(db: Session, *, user_id: str) -> dashboard_models.DashboardStatsResponse:
    """
    Performs all aggregation queries for the dashboard in one go.
    """
    
    # --- 1. KPI Stats ---
    
    # Base query for user's scans
    user_scans_query = db.query(scan_schema.Scan).filter(scan_schema.Scan.userId == user_id)
    
    total_scans = user_scans_query.count()
    
    scans_today = user_scans_query.filter(
        scan_schema.Scan.createdAt >= datetime.now() - timedelta(days=1)
    ).count()
    
    # --- FIX: Filter for 'vuln_report_complete' instead of 'completed' ---
    avg_time_result = user_scans_query.filter(
        scan_schema.Scan.status == "vuln_report_complete"
    ).with_entities(
        func.avg(
            func.extract('epoch', scan_schema.Scan.updatedAt - scan_schema.Scan.createdAt)
        ).label('avg_seconds')
    ).first()
    # ------------------------------------------------------------------
    
    avg_scan_time_seconds = avg_time_result.avg_seconds if avg_time_result and avg_time_result.avg_seconds else None
    
    # Count total generated reports
    total_reports_generated = (
        db.query(func.count(scan_schema.ScanFile.id))
        .join(scan_schema.ToolExecution, scan_schema.ScanFile.toolExecutionId == scan_schema.ToolExecution.id)
        .join(scan_schema.Scan, scan_schema.ToolExecution.scanId == scan_schema.Scan.id)
        .filter(scan_schema.Scan.userId == user_id)
        .filter(scan_schema.ToolExecution.toolName.in_(['llm-recon-report', 'llm-vulnr-report']))
        .scalar()
    )
    
    kpis = dashboard_models.KpiStats(
        total_scans=total_scans,
        scans_today=scans_today,
        avg_scan_time_seconds=avg_scan_time_seconds,
        total_reports_generated=total_reports_generated
    )
    
    # --- 2. Scans Over Time (Last 7 Days) ---
    seven_days_ago = datetime.now() - timedelta(days=7)
    
    scans_over_time_data = (
        user_scans_query
        .filter(scan_schema.Scan.createdAt >= seven_days_ago)
        .with_entities(
            cast(scan_schema.Scan.createdAt, Date).label('date'),
            func.count(scan_schema.Scan.id).label('count')
        )
        .group_by(cast(scan_schema.Scan.createdAt, Date))
        .order_by(cast(scan_schema.Scan.createdAt, Date))
        .all()
    )
    
    scans_last_7_days = [
        dashboard_models.ScansOverTime(date=day.date.strftime('%Y-%m-%d'), count=day.count)
        for day in scans_over_time_data
    ]
    
    # --- 3. Status Breakdown ---
    status_breakdown_data = (
        user_scans_query
        .with_entities(
            scan_schema.Scan.status,
            func.count(scan_schema.Scan.id).label('count')
        )
        .group_by(scan_schema.Scan.status)
        .all()
    )
    
    status_breakdown = [
        dashboard_models.StatusBreakdown(status=row.status, count=row.count)
        for row in status_breakdown_data
    ]
    
    # --- 4. Combine and Return ---
    return dashboard_models.DashboardStatsResponse(
        kpis=kpis,
        scans_last_7_days=scans_last_7_days,
        status_breakdown=status_breakdown
    )

