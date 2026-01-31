"""Dashboard Routes"""

from fastapi import APIRouter, Depends
from app.schemas.user import User
from app.schemas.subscription import DashboardStats
from app.services.subscription_service import SubscriptionService
from app.core.security import get_admin_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: User = Depends(get_admin_user)):
    """
    Get dashboard statistics (Admin only)
    
    Returns:
    - total_subscriptions: Total number of subscriptions
    - upcoming_renewals: Renewals in next 30 days
    - renewals_due_today: Renewals due today
    - expired_subscriptions: Expired subscriptions
    """
    stats = await SubscriptionService.get_dashboard_stats()
    return stats
