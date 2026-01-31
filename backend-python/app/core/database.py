"""Database Connection and Management"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import MONGO_URL, DB_NAME

# Global database instance
_db_client: AsyncIOMotorClient = None
_db: AsyncIOMotorDatabase = None


async def connect_db():
    """Establish database connection"""
    global _db_client, _db
    _db_client = AsyncIOMotorClient(MONGO_URL)
    _db = _db_client[DB_NAME]
    
    # Test connection
    await _db.command('ping')
    print(f"Connected to MongoDB: {DB_NAME}")


async def close_db():
    """Close database connection"""
    global _db_client
    if _db_client:
        _db_client.close()
        print("MongoDB connection closed")


def get_db() -> AsyncIOMotorDatabase:
    """Get database instance"""
    if _db is None:
        raise RuntimeError("Database not initialized. Call connect_db() first.")
    return _db


async def get_users_collection():
    """Get users collection"""
    db = get_db()
    return db.users


async def get_subscriptions_collection():
    """Get subscriptions collection"""
    db = get_db()
    return db.subscriptions
