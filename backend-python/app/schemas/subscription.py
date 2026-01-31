"""Subscription Schemas and Models"""

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
from typing import Optional
import uuid


class Subscription(BaseModel):
    """Subscription model"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    business_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    price: float
    paid_date: str  # YYYY-MM-DD format
    renewal_date: str  # YYYY-MM-DD format
    duration: str  # "Monthly", "6 Months", "1 Year", "2 Years", "3 Years"
    type: str  # "Personal", "Client", "Official"
    category: str  # "Domain", "Hosting Platform", "WhatsApp API", "SSL", "Cloud Service", "Others"
    notes: Optional[str] = None
    status: str = "Active"  # "Upcoming", "Active", "Expiring Soon", "Expiring Today", "Expired"
    created_by: str  # user id
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SubscriptionCreate(BaseModel):
    """Subscription creation schema"""
    client_name: str
    business_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    price: float
    paid_date: str
    renewal_date: str
    duration: str
    type: str
    category: str
    notes: Optional[str] = None


class SubscriptionUpdate(BaseModel):
    """Subscription update schema"""
    client_name: Optional[str] = None
    business_name: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    price: Optional[float] = None
    paid_date: Optional[str] = None
    renewal_date: Optional[str] = None
    duration: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None


class DashboardStats(BaseModel):
    """Dashboard statistics model"""
    total_subscriptions: int
    upcoming_renewals: int  # Next 30 days
    renewals_due_today: int
    expired_subscriptions: int
