"""Application Entry Point"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.core.config import (
    APP_NAME,
    APP_VERSION,
    DEBUG,
    CORS_ORIGINS,
    LOG_LEVEL,
    LOG_FORMAT,
    ADMIN_EMAIL,
    ADMIN_PASSWORD
)
from app.core.database import connect_db, close_db
from app.api.endpoints import api_router
from app.services.user_service import UserService
from app.core.security import hash_password

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format=LOG_FORMAT
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application
    Handles startup and shutdown events
    """
    # Startup
    logger.info("Starting application...")
    await connect_db()
    await create_default_admin()
    logger.info(f"{APP_NAME} v{APP_VERSION} started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    await close_db()
    logger.info("Application stopped")


# Create FastAPI application
app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Subscription Manager Backend API",
    debug=DEBUG,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router)


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API health check"""
    return {
        "message": f"Welcome to {APP_NAME}",
        "version": APP_VERSION,
        "status": "running"
    }


@app.get("/health", tags=["Health"])
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": APP_VERSION
    }


async def create_default_admin():
    """Create default admin user on startup"""
    try:
        from app.schemas.user import UserCreate, UserUpdate
        import secrets
        import string

        # 1. Determine Password Strategy
        password = None
        log_password = "<hidden>"

        if ADMIN_PASSWORD:
            password = ADMIN_PASSWORD
            log_password = password if DEBUG else "<hidden>"
        elif DEBUG:
            # Generate random password in debug mode
            alphabet = string.ascii_letters + string.digits
            password = ''.join(secrets.choice(alphabet) for i in range(12))
            log_password = password
        else:
            # Production mode, no password set. 
            # If user exists, leave as is. If not, skip creation.
            return

        # 2. Check for existing admin
        existing_admin = await UserService.get_user_by_email(ADMIN_EMAIL)

        if existing_admin:
            # 3. Update existing admin password
            user_id = existing_admin.get('id')
            if user_id:
                try:
                    update_data = UserUpdate(password=password)
                    await UserService.update_user(user_id, update_data)
                    logger.info(f"Default admin updated: {ADMIN_EMAIL} / {log_password}")
                except Exception as ex:
                    logger.error(f"Failed to update existing admin: {ex}")
            else:
                logger.warning(f"Existing admin found ({ADMIN_EMAIL}) but has no ID, skipping update.")
        else:
            # 4. Create new admin
            try:
                admin_data = UserCreate(
                    name="Admin",
                    email=ADMIN_EMAIL,
                    phone="9999999999",
                    password=password,
                    role="admin"
                )
                await UserService.create_user(admin_data)
                logger.info(f"Default admin created: {ADMIN_EMAIL} / {log_password}")
            except Exception as ex:
                logger.error(f"Failed to create admin: {ex}")

    except Exception as e:
        logger.warning(f"Error in create_default_admin: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=DEBUG,
        log_level=LOG_LEVEL.lower()
    )
