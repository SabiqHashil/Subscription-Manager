# Backend Project Structure Guide

## Overview

The backend is reorganized into a clean, modular architecture following best practices for FastAPI applications.

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Configuration management
│   │   ├── database.py            # Database connection & queries
│   │   └── security.py            # JWT & authentication logic
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py               # User Pydantic models
│   │   └── subscription.py       # Subscription Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── user_service.py       # User business logic
│   │   └── subscription_service.py # Subscription business logic
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py               # Authentication endpoints
│   │   ├── staff.py              # Staff management endpoints
│   │   ├── subscriptions.py      # Subscription endpoints
│   │   └── dashboard.py          # Dashboard endpoints
│   ├── api/
│   │   └── endpoints.py          # API router configuration
│   └── utils/
│       ├── __init__.py
│       ├── constants.py          # App constants
│       └── helpers.py            # Helper functions
├── main.py                       # Application entry point
├── requirements.txt              # Python dependencies
└── .env.example                  # Environment variables template
```

## Module Descriptions

### Core Module (`app/core/`)

- **config.py**: Centralized configuration management for database, JWT, CORS, logging
- **database.py**: MongoDB connection management and collection accessors
- **security.py**: JWT token creation, password hashing, authentication middleware

### Schemas Module (`app/schemas/`)

- **user.py**: Pydantic models for user (User, UserCreate, UserUpdate, LoginRequest, LoginResponse)
- **subscription.py**: Pydantic models for subscriptions and dashboard stats

### Services Module (`app/services/`)

Contains business logic separated from routes:

- **user_service.py**: UserService class with methods for CRUD operations, authentication
- **subscription_service.py**: SubscriptionService class for subscription management and statistics

### Routes Module (`app/routes/`)

API endpoints organized by domain:

- **auth.py**: Login, register, get current user
- **staff.py**: Staff CRUD operations (admin only)
- **subscriptions.py**: Subscription CRUD operations
- **dashboard.py**: Dashboard statistics

### Utils Module (`app/utils/`)

- **constants.py**: User roles, subscription types, categories, statuses
- **helpers.py**: Utility functions for status calculation, date parsing

## Key Architecture Patterns

### 1. Dependency Injection

Uses FastAPI's `Depends()` for:
- Database operations
- Authentication checks
- Authorization checks

### 2. Separation of Concerns

- **Routes**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Schemas**: Define data validation and serialization
- **Core**: Handle infrastructure (database, security, config)

### 3. Error Handling

- HTTP exceptions with proper status codes
- Consistent error responses
- Validation at schema level

### 4. Security

- Password hashing with bcrypt
- JWT token-based authentication
- Admin authorization middleware
- Token refresh capability

## Running the Application

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Create `.env` file

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=subscription_manager
JWT_SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
DEBUG=False
LOG_LEVEL=INFO
```

### Run Application

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Access API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/me` - Get current user

### Staff Management (Admin Only)
- `GET /api/staff` - Get all staff
- `GET /api/staff/{staff_id}` - Get staff by ID
- `PUT /api/staff/{staff_id}` - Update staff
- `DELETE /api/staff/{staff_id}` - Delete staff

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create subscription (admin only)
- `GET /api/subscriptions/{id}` - Get subscription by ID
- `PUT /api/subscriptions/{id}` - Update subscription (admin only)
- `DELETE /api/subscriptions/{id}` - Delete subscription (admin only)

### Dashboard (Admin Only)
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Models

### Users Collection

```json
{
  "_id": ObjectId,
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "role": "admin|staff",
  "password_hash": "string",
  "created_at": "ISO datetime"
}
```

### Subscriptions Collection

```json
{
  "_id": ObjectId,
  "id": "uuid",
  "client_name": "string",
  "business_name": "string",
  "client_email": "string",
  "client_phone": "string",
  "price": "float",
  "paid_date": "YYYY-MM-DD",
  "renewal_date": "YYYY-MM-DD",
  "duration": "string",
  "type": "Personal|Client|Official",
  "category": "string",
  "notes": "string",
  "status": "Upcoming|Active|Expiring Soon|Expiring Today|Expired",
  "created_by": "user_id",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

## Best Practices Implemented

✅ **Modular Architecture**: Each module has a single responsibility
✅ **DRY Principle**: No code duplication, reusable services
✅ **Type Hints**: Full type annotations for IDE support
✅ **Error Handling**: Proper HTTP status codes and error messages
✅ **Security**: JWT authentication, password hashing, admin checks
✅ **Logging**: Structured logging for debugging
✅ **Configuration**: Environment-based configuration
✅ **Documentation**: Docstrings and inline comments
✅ **Validation**: Pydantic model validation
✅ **Async/Await**: Asynchronous database operations

## Extending the Application

### Adding a New Endpoint

1. Create schema in `app/schemas/`
2. Create service methods in `app/services/`
3. Create route in `app/routes/`
4. Include router in `app/api/endpoints.py`

### Adding a New Service

1. Create `service_name.py` in `app/services/`
2. Create service class with static methods
3. Use in routes with dependency injection

## Testing

Create tests in `tests/` directory following:

```python
# tests/test_auth.py
import pytest
from app.services.user_service import UserService

@pytest.mark.asyncio
async def test_login():
    # Test login functionality
    pass
```

## Troubleshooting

### Database Connection Issues

- Check `MONGO_URL` in `.env`
- Ensure MongoDB is running
- Check network connectivity

### JWT Token Issues

- Verify `JWT_SECRET_KEY` is set
- Check token expiration
- Ensure token is in `Authorization: Bearer <token>` format

### CORS Issues

- Update `CORS_ORIGINS` in `.env` with frontend URL
- Check browser console for specific error

## Contributing

1. Follow the existing structure
2. Add type hints
3. Add docstrings
4. Test before committing
5. Update this document if adding new modules
