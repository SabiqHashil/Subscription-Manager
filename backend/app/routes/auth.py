"""Authentication Routes"""

from fastapi import APIRouter, Depends, status
from app.schemas.user import User, UserCreate, LoginRequest, LoginResponse
from app.services.user_service import UserService
from app.core.security import create_access_token, get_current_user, get_admin_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, current_user: User = Depends(get_admin_user)):
    """
    Register new user (Admin only)
    
    - **user_data**: User information to register
    - **current_user**: Must be admin
    """
    user = await UserService.create_user(user_data)
    return user


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """
    Login endpoint - Authenticate user with email and password
    
    - **login_data**: Email and password credentials
    """
    user = await UserService.authenticate_user(login_data.email, login_data.password)
    access_token = create_access_token(data={"sub": user.id})
    
    return LoginResponse(access_token=access_token, user=user)


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return current_user
