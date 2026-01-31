"""Helper Functions"""

from datetime import datetime, timezone, timedelta
from app.utils.constants import (
    SUBSCRIPTION_STATUS_UPCOMING,
    SUBSCRIPTION_STATUS_ACTIVE,
    SUBSCRIPTION_STATUS_EXPIRING_SOON,
    SUBSCRIPTION_STATUS_EXPIRING_TODAY,
    SUBSCRIPTION_STATUS_EXPIRED,
    STATUS_EXPIRING_TODAY_DAYS,
    STATUS_EXPIRING_SOON_DAYS,
    STATUS_ACTIVE_DAYS
)


def calculate_subscription_status(renewal_date_str: str) -> str:
    """
    Calculate subscription status based on renewal date
    
    Args:
        renewal_date_str: Renewal date in YYYY-MM-DD format
        
    Returns:
        Status string
    """
    try:
        renewal_date = datetime.strptime(renewal_date_str, "%Y-%m-%d").date()
        today = datetime.now(timezone.utc).date()
        days_diff = (renewal_date - today).days
        
        if days_diff < STATUS_EXPIRING_TODAY_DAYS:
            return SUBSCRIPTION_STATUS_EXPIRED
        elif days_diff == STATUS_EXPIRING_TODAY_DAYS:
            return SUBSCRIPTION_STATUS_EXPIRING_TODAY
        elif days_diff <= STATUS_EXPIRING_SOON_DAYS:
            return SUBSCRIPTION_STATUS_EXPIRING_SOON
        elif days_diff <= STATUS_ACTIVE_DAYS:
            return SUBSCRIPTION_STATUS_ACTIVE
        else:
            return SUBSCRIPTION_STATUS_UPCOMING
    except (ValueError, TypeError):
        return SUBSCRIPTION_STATUS_ACTIVE


def parse_datetime_string(date_str: str) -> datetime:
    """
    Parse ISO format datetime string
    
    Args:
        date_str: ISO format datetime string
        
    Returns:
        Datetime object
    """
    if isinstance(date_str, str):
        return datetime.fromisoformat(date_str)
    return date_str


def convert_datetime_to_string(dt: datetime) -> str:
    """
    Convert datetime to ISO format string
    
    Args:
        dt: Datetime object
        
    Returns:
        ISO format datetime string
    """
    if isinstance(dt, datetime):
        return dt.isoformat()
    return dt
