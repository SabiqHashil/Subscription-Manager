"""Subscription Routes"""

from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.user import User
from app.schemas.subscription import Subscription, SubscriptionCreate, SubscriptionUpdate
from app.services.subscription_service import SubscriptionService
from app.core.security import get_current_user, get_admin_user

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.post("", response_model=Subscription, status_code=status.HTTP_201_CREATED)
async def create_subscription(sub_data: SubscriptionCreate, current_user: User = Depends(get_admin_user)):
    """
    Create new subscription (Admin only)
    
    - **sub_data**: Subscription information
    """
    subscription = await SubscriptionService.create_subscription(sub_data, current_user.id)
    return subscription


@router.get("", response_model=List[Subscription])
async def get_subscriptions(current_user: User = Depends(get_current_user)):
    """
    Get all subscriptions (Admin and Staff)
    """
    subscriptions = await SubscriptionService.get_subscriptions()
    return subscriptions


@router.get("/{subscription_id}", response_model=Subscription)
async def get_subscription(subscription_id: str, current_user: User = Depends(get_current_user)):
    """
    Get specific subscription by ID
    
    - **subscription_id**: Subscription ID
    """
    subscription = await SubscriptionService.get_subscription_by_id(subscription_id)
    return subscription


@router.put("/{subscription_id}", response_model=Subscription)
async def update_subscription(
    subscription_id: str,
    update_data: SubscriptionUpdate,
    current_user: User = Depends(get_admin_user)
):
    """
    Update subscription (Admin only)
    
    - **subscription_id**: Subscription ID to update
    - **update_data**: Fields to update
    """
    subscription = await SubscriptionService.update_subscription(subscription_id, update_data)
    return subscription


@router.delete("/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subscription(subscription_id: str, current_user: User = Depends(get_admin_user)):
    """
    Delete subscription (Admin only)
    
    - **subscription_id**: Subscription ID to delete
    """
    await SubscriptionService.delete_subscription(subscription_id)
    return None
