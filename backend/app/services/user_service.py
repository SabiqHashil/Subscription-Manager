"""User Service - Business Logic for User Management"""

from typing import List, Optional
from fastapi import HTTPException, status
from app.schemas.user import User, UserCreate, UserUpdate
from app.core.security import hash_password, verify_password, create_access_token
from app.core.database import get_users_collection
from app.utils.constants import USER_ROLE_ADMIN, USER_ROLE_STAFF


class UserService:
    """User service for handling user operations"""
    
    @staticmethod
    async def create_user(user_data: UserCreate) -> User:
        """Create a new user"""
        users_collection = await get_users_collection()
        
        # Check if email already exists
        existing_user = await users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user object
        user = User(
            name=user_data.name,
            email=user_data.email,
            phone=user_data.phone,
            role=user_data.role,
            access_level=user_data.access_level
        )
        
        # Prepare document for database
        doc = user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['password_hash'] = hash_password(user_data.password)
        
        # Insert into database
        await users_collection.insert_one(doc)
        return user
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[dict]:
        """Get user by email"""
        users_collection = await get_users_collection()
        user = await users_collection.find_one({"email": email}, {"_id": 0})
        return user
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[User]:
        """Get user by ID"""
        users_collection = await get_users_collection()
        user_doc = await users_collection.find_one({"id": user_id}, {"_id": 0})
        
        if not user_doc:
            return None
        
        if isinstance(user_doc.get('created_at'), str):
            from app.utils.helpers import parse_datetime_string
            user_doc['created_at'] = parse_datetime_string(user_doc['created_at'])
        
        return User(**user_doc)
    
    @staticmethod
    async def get_staff_members() -> List[User]:
        """Get all staff members"""
        users_collection = await get_users_collection()
        staff_list = await users_collection.find(
            {"role": USER_ROLE_STAFF},
            {"_id": 0}
        ).to_list(1000)
        
        for staff in staff_list:
            if isinstance(staff.get('created_at'), str):
                from app.utils.helpers import parse_datetime_string
                staff['created_at'] = parse_datetime_string(staff['created_at'])
        
        return [User(**staff) for staff in staff_list]
    
    @staticmethod
    async def update_user(user_id: str, update_data: UserUpdate) -> User:
        """Update user information"""
        users_collection = await get_users_collection()
        
        # Check if user exists
        user = await users_collection.find_one({"id": user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Prepare update data
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
        
        # Hash password if provided
        if 'password' in update_dict:
            update_dict['password_hash'] = hash_password(update_dict['password'])
            del update_dict['password']
        
        # Update in database
        if update_dict:
            await users_collection.update_one({"id": user_id}, {"$set": update_dict})
        
        # Return updated user
        updated_user_doc = await users_collection.find_one({"id": user_id}, {"_id": 0})
        if isinstance(updated_user_doc.get('created_at'), str):
            from app.utils.helpers import parse_datetime_string
            updated_user_doc['created_at'] = parse_datetime_string(updated_user_doc['created_at'])
        
        return User(**updated_user_doc)
    
    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete a user"""
        users_collection = await get_users_collection()
        result = await users_collection.delete_one({"id": user_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return True
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> User:
        """Authenticate user with email and password"""
        users_collection = await get_users_collection()
        user_doc = await users_collection.find_one({"email": email}, {"_id": 0})
        
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not verify_password(password, user_doc.get('password_hash', '')):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if isinstance(user_doc.get('created_at'), str):
            from app.utils.helpers import parse_datetime_string
            user_doc['created_at'] = parse_datetime_string(user_doc['created_at'])
        
        return User(**user_doc)
