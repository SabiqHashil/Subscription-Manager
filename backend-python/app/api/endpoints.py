"""API Endpoints Router"""

from fastapi import APIRouter
from app.routes import auth, staff, subscriptions, dashboard

api_router = APIRouter(prefix="/api")

# Include route routers
api_router.include_router(auth.router)
api_router.include_router(staff.router)
api_router.include_router(subscriptions.router)
api_router.include_router(dashboard.router)

__all__ = ["api_router"]
