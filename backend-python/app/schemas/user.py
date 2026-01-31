"""User Schemas and Models"""

from pydantic import BaseModel, Field, ConfigDict, EmailStr
from datetime import datetime, timezone
from typing import Optional, Literal
import uuid


class User(BaseModel):
    """User model"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    role: str  # "admin" or "staff"
    access_level: Literal["full", "view_only"] = "full"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserCreate(BaseModel):
    """User creation schema"""
    name: str
    email: EmailStr
    phone: str
    password: str
    password: str
    role: str = "staff"
    access_level: Literal["full", "view_only"] = "full"


class UserUpdate(BaseModel):
    """User update schema"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    access_level: Optional[Literal["full", "view_only"]] = None


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Login response schema"""
    access_token: str
    token_type: str = "bearer"
    user: User
