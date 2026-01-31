from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ Models ============

class UserRole:
    ADMIN = "admin"
    STAFF = "staff"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    role: str  # admin or staff
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: str = UserRole.STAFF

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class Subscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    business_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    price: float
    paid_date: str  # YYYY-MM-DD format
    renewal_date: str  # YYYY-MM-DD format
    duration: str  # Monthly, 6 Months, 1 Year, 2 Years, 3 Years
    type: str  # Personal, Client, Official
    category: str  # Domain, Hosting Platform, WhatsApp API, SSL, Cloud Service, Others
    notes: Optional[str] = None
    status: str = "Active"  # Upcoming, Active, Expiring Soon, Expired
    created_by: str  # user id
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SubscriptionCreate(BaseModel):
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
    total_subscriptions: int
    upcoming_renewals: int  # Next 30 days
    renewals_due_today: int
    expired_subscriptions: int

# ============ Helper Functions ============

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def calculate_status(renewal_date_str: str) -> str:
    """Calculate subscription status based on renewal date"""
    try:
        renewal_date = datetime.strptime(renewal_date_str, "%Y-%m-%d").date()
        today = datetime.now(timezone.utc).date()
        days_diff = (renewal_date - today).days
        
        if days_diff < 0:
            return "Expired"
        elif days_diff == 0:
            return "Expiring Today"
        elif days_diff <= 30:
            return "Expiring Soon"
        elif days_diff <= 90:
            return "Active"
        else:
            return "Upcoming"
    except:
        return "Active"

# ============ Auth Routes ============

@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate, current_user: User = Depends(get_admin_user)):
    """Admin only - Register new user (staff or admin)"""
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        role=user_data.role
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['password_hash'] = hash_password(user_data.password)
    
    await db.users.insert_one(doc)
    return user

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """Login endpoint"""
    user_doc = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user_doc.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user_doc['id']})
    
    # Convert datetime
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    
    return LoginResponse(access_token=access_token, user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user

# ============ Staff Management Routes (Admin Only) ============

@api_router.get("/staff", response_model=List[User])
async def get_staff(current_user: User = Depends(get_admin_user)):
    """Get all staff members"""
    staff_list = await db.users.find({"role": UserRole.STAFF}, {"_id": 0}).to_list(1000)
    
    for staff in staff_list:
        if isinstance(staff['created_at'], str):
            staff['created_at'] = datetime.fromisoformat(staff['created_at'])
    
    return staff_list

@api_router.get("/staff/{staff_id}", response_model=User)
async def get_staff_by_id(staff_id: str, current_user: User = Depends(get_admin_user)):
    """Get specific staff member"""
    staff = await db.users.find_one({"id": staff_id, "role": UserRole.STAFF}, {"_id": 0})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    if isinstance(staff['created_at'], str):
        staff['created_at'] = datetime.fromisoformat(staff['created_at'])
    
    return User(**staff)

@api_router.put("/staff/{staff_id}", response_model=User)
async def update_staff(staff_id: str, update_data: UserUpdate, current_user: User = Depends(get_admin_user)):
    """Update staff member"""
    staff = await db.users.find_one({"id": staff_id, "role": UserRole.STAFF})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if 'password' in update_dict:
        update_dict['password_hash'] = hash_password(update_dict['password'])
        del update_dict['password']
    
    if update_dict:
        await db.users.update_one({"id": staff_id}, {"$set": update_dict})
    
    updated_staff = await db.users.find_one({"id": staff_id}, {"_id": 0})
    if isinstance(updated_staff['created_at'], str):
        updated_staff['created_at'] = datetime.fromisoformat(updated_staff['created_at'])
    
    return User(**updated_staff)

@api_router.delete("/staff/{staff_id}")
async def delete_staff(staff_id: str, current_user: User = Depends(get_admin_user)):
    """Delete staff member"""
    result = await db.users.delete_one({"id": staff_id, "role": UserRole.STAFF})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    return {"message": "Staff deleted successfully"}

# ============ Subscription Routes ============

@api_router.post("/subscriptions", response_model=Subscription)
async def create_subscription(sub_data: SubscriptionCreate, current_user: User = Depends(get_admin_user)):
    """Create new subscription (Admin only)"""
    status = calculate_status(sub_data.renewal_date)
    
    subscription = Subscription(
        **sub_data.model_dump(),
        status=status,
        created_by=current_user.id
    )
    
    doc = subscription.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.subscriptions.insert_one(doc)
    return subscription

@api_router.get("/subscriptions", response_model=List[Subscription])
async def get_subscriptions(current_user: User = Depends(get_current_user)):
    """Get all subscriptions (Admin and Staff)"""
    subscriptions = await db.subscriptions.find({}, {"_id": 0}).to_list(10000)
    
    for sub in subscriptions:
        if isinstance(sub['created_at'], str):
            sub['created_at'] = datetime.fromisoformat(sub['created_at'])
        if isinstance(sub['updated_at'], str):
            sub['updated_at'] = datetime.fromisoformat(sub['updated_at'])
        # Recalculate status
        sub['status'] = calculate_status(sub['renewal_date'])
    
    return subscriptions

@api_router.get("/subscriptions/{subscription_id}", response_model=Subscription)
async def get_subscription(subscription_id: str, current_user: User = Depends(get_current_user)):
    """Get specific subscription"""
    sub = await db.subscriptions.find_one({"id": subscription_id}, {"_id": 0})
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    if isinstance(sub['created_at'], str):
        sub['created_at'] = datetime.fromisoformat(sub['created_at'])
    if isinstance(sub['updated_at'], str):
        sub['updated_at'] = datetime.fromisoformat(sub['updated_at'])
    
    sub['status'] = calculate_status(sub['renewal_date'])
    
    return Subscription(**sub)

@api_router.put("/subscriptions/{subscription_id}", response_model=Subscription)
async def update_subscription(subscription_id: str, update_data: SubscriptionUpdate, current_user: User = Depends(get_admin_user)):
    """Update subscription (Admin only)"""
    sub = await db.subscriptions.find_one({"id": subscription_id})
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        # Recalculate status if renewal_date changed
        if 'renewal_date' in update_dict:
            update_dict['status'] = calculate_status(update_dict['renewal_date'])
        
        await db.subscriptions.update_one({"id": subscription_id}, {"$set": update_dict})
    
    updated_sub = await db.subscriptions.find_one({"id": subscription_id}, {"_id": 0})
    if isinstance(updated_sub['created_at'], str):
        updated_sub['created_at'] = datetime.fromisoformat(updated_sub['created_at'])
    if isinstance(updated_sub['updated_at'], str):
        updated_sub['updated_at'] = datetime.fromisoformat(updated_sub['updated_at'])
    
    return Subscription(**updated_sub)

@api_router.delete("/subscriptions/{subscription_id}")
async def delete_subscription(subscription_id: str, current_user: User = Depends(get_admin_user)):
    """Delete subscription (Admin only)"""
    result = await db.subscriptions.delete_one({"id": subscription_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Subscription deleted successfully"}

# ============ Dashboard Routes ============

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: User = Depends(get_admin_user)):
    """Get dashboard statistics (Admin only)"""
    today = datetime.now(timezone.utc).date()
    today_str = today.strftime("%Y-%m-%d")
    days_30_later = (today + timedelta(days=30)).strftime("%Y-%m-%d")
    
    all_subs = await db.subscriptions.find({}, {"_id": 0, "renewal_date": 1}).to_list(10000)
    
    total = len(all_subs)
    upcoming = 0
    due_today = 0
    expired = 0
    
    for sub in all_subs:
        renewal_date = sub['renewal_date']
        try:
            renewal = datetime.strptime(renewal_date, "%Y-%m-%d").date()
            if renewal < today:
                expired += 1
            elif renewal == today:
                due_today += 1
            elif renewal <= (today + timedelta(days=30)):
                upcoming += 1
        except:
            pass
    
    return DashboardStats(
        total_subscriptions=total,
        upcoming_renewals=upcoming,
        renewals_due_today=due_today,
        expired_subscriptions=expired
    )

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Create default admin user on startup
@app.on_event("startup")
async def create_default_admin():
    existing_admin = await db.users.find_one({"email": "admin@subscriptionmanager.com"})
    if not existing_admin:
        admin = User(
            name="Admin",
            email="admin@subscriptionmanager.com",
            phone="9999999999",
            role=UserRole.ADMIN
        )
        doc = admin.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['password_hash'] = hash_password("admin123")
        await db.users.insert_one(doc)
        logger.info("Default admin created: admin@subscriptionmanager.com / admin123")
