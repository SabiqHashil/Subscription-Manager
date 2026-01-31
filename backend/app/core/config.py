"""Application Configuration"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / '.env')

# ============ General Configuration ============
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
APP_NAME = os.environ.get('APP_NAME', 'Subscription Manager API')
APP_VERSION = "1.0.0"

# ============ Database Configuration ============
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'subscription_manager')

# ============ JWT Configuration ============
# ============ JWT Configuration ============
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
if SECRET_KEY == 'your-secret-key-change-in-production' and not DEBUG:
    import warnings
    warnings.warn("Is using default insecure SECRET_KEY in production environment!", UserWarning)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# ============ Admin Configuration ============
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@subscriptionmanager.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')

# ============ CORS Configuration ============
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

# ============ Logging Configuration ============
LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
