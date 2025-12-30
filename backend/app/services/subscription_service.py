"""Subscription Service - Business Logic for Subscription Management"""

from typing import List, Optional
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, status
from app.schemas.subscription import Subscription, SubscriptionCreate, SubscriptionUpdate, DashboardStats
from app.core.database import get_subscriptions_collection
from app.utils.helpers import calculate_subscription_status, parse_datetime_string


class SubscriptionService:
    """Subscription service for handling subscription operations"""
    
    @staticmethod
    async def create_subscription(sub_data: SubscriptionCreate, user_id: str) -> Subscription:
        """Create a new subscription"""
        subs_collection = await get_subscriptions_collection()
        
        # Calculate status
        status = calculate_subscription_status(sub_data.renewal_date)
        
        # Create subscription object
        subscription = Subscription(
            **sub_data.model_dump(),
            status=status,
            created_by=user_id
        )
        
        # Prepare document for database
        doc = subscription.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        # Insert into database
        await subs_collection.insert_one(doc)
        return subscription
    
    @staticmethod
    async def get_subscriptions() -> List[Subscription]:
        """Get all subscriptions"""
        subs_collection = await get_subscriptions_collection()
        subscriptions = await subs_collection.find({}, {"_id": 0}).to_list(10000)
        
        for sub in subscriptions:
            if isinstance(sub.get('created_at'), str):
                sub['created_at'] = parse_datetime_string(sub['created_at'])
            if isinstance(sub.get('updated_at'), str):
                sub['updated_at'] = parse_datetime_string(sub['updated_at'])
            
            # Recalculate status
            sub['status'] = calculate_subscription_status(sub['renewal_date'])
        
        return [Subscription(**sub) for sub in subscriptions]
    
    @staticmethod
    async def get_subscription_by_id(subscription_id: str) -> Subscription:
        """Get subscription by ID"""
        subs_collection = await get_subscriptions_collection()
        sub = await subs_collection.find_one({"id": subscription_id}, {"_id": 0})
        
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found"
            )
        
        if isinstance(sub.get('created_at'), str):
            sub['created_at'] = parse_datetime_string(sub['created_at'])
        if isinstance(sub.get('updated_at'), str):
            sub['updated_at'] = parse_datetime_string(sub['updated_at'])
        
        sub['status'] = calculate_subscription_status(sub['renewal_date'])
        
        return Subscription(**sub)
    
    @staticmethod
    async def update_subscription(subscription_id: str, update_data: SubscriptionUpdate) -> Subscription:
        """Update subscription"""
        subs_collection = await get_subscriptions_collection()
        
        # Check if subscription exists
        sub = await subs_collection.find_one({"id": subscription_id})
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found"
            )
        
        # Prepare update data
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
        
        if update_dict:
            update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
            
            # Recalculate status if renewal_date changed
            if 'renewal_date' in update_dict:
                update_dict['status'] = calculate_subscription_status(update_dict['renewal_date'])
            
            await subs_collection.update_one({"id": subscription_id}, {"$set": update_dict})
        
        # Return updated subscription
        updated_sub = await subs_collection.find_one({"id": subscription_id}, {"_id": 0})
        if isinstance(updated_sub.get('created_at'), str):
            updated_sub['created_at'] = parse_datetime_string(updated_sub['created_at'])
        if isinstance(updated_sub.get('updated_at'), str):
            updated_sub['updated_at'] = parse_datetime_string(updated_sub['updated_at'])
        
        return Subscription(**updated_sub)
    
    @staticmethod
    async def delete_subscription(subscription_id: str) -> bool:
        """Delete subscription"""
        subs_collection = await get_subscriptions_collection()
        result = await subs_collection.delete_one({"id": subscription_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found"
            )
        
        return True
    
    @staticmethod
    async def get_dashboard_stats() -> DashboardStats:
        """Get dashboard statistics"""
        subs_collection = await get_subscriptions_collection()
        
        today = datetime.now(timezone.utc).date()
        all_subs = await subs_collection.find({}, {"_id": 0, "renewal_date": 1}).to_list(10000)
        
        total = len(all_subs)
        upcoming = 0
        due_today = 0
        expired = 0
        
        for sub in all_subs:
            renewal_date_str = sub.get('renewal_date')
            try:
                renewal_date = datetime.strptime(renewal_date_str, "%Y-%m-%d").date()
                
                if renewal_date < today:
                    expired += 1
                elif renewal_date == today:
                    due_today += 1
                elif renewal_date <= (today + timedelta(days=30)):
                    upcoming += 1
            except (ValueError, TypeError):
                pass
        
        return DashboardStats(
            total_subscriptions=total,
            upcoming_renewals=upcoming,
            renewals_due_today=due_today,
            expired_subscriptions=expired
        )
