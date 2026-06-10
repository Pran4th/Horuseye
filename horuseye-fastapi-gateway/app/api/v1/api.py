from fastapi import APIRouter
from app.api.v1.endpoints import auth, protected, scan, internal,scans, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(protected.router, prefix="/users", tags=["users"])
api_router.include_router(scan.router, prefix="/scan", tags=["scan"]) 
api_router.include_router(internal.router, prefix="/internal", tags=["internal"]) 
api_router.include_router(scans.router, prefix="/scans", tags=["scans"]) # For viewing/managing scans
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"]) # 2. Add dashboard router
