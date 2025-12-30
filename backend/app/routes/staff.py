"""Staff Management Routes"""

from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.user import User, UserUpdate
from app.services.user_service import UserService
from app.core.security import get_current_user, get_admin_user

router = APIRouter(prefix="/staff", tags=["Staff Management"])


@router.get("", response_model=List[User])
async def get_staff(current_user: User = Depends(get_admin_user)):
    """
    Get all staff members (Admin only)
    """
    staff_list = await UserService.get_staff_members()
    return staff_list


@router.get("/{staff_id}", response_model=User)
async def get_staff_by_id(staff_id: str, current_user: User = Depends(get_admin_user)):
    """
    Get specific staff member by ID (Admin only)
    
    - **staff_id**: Staff member ID
    """
    staff = await UserService.get_user_by_id(staff_id)
    if not staff:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Staff not found")
    
    return staff


@router.put("/{staff_id}", response_model=User)
async def update_staff(staff_id: str, update_data: UserUpdate, current_user: User = Depends(get_admin_user)):
    """
    Update staff member information (Admin only)
    
    - **staff_id**: Staff member ID
    - **update_data**: Fields to update
    """
    staff = await UserService.update_user(staff_id, update_data)
    return staff


@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_staff(staff_id: str, current_user: User = Depends(get_admin_user)):
    """
    Delete staff member (Admin only)
    
    - **staff_id**: Staff member ID to delete
    """
    await UserService.delete_user(staff_id)
    return None
