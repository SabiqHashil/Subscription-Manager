# Project Structure Standards

## Backend (Python/FastAPI)

### ✅ Implemented Standards

#### 1. **Separation of Concerns**
- `routes/` - HTTP endpoints only
- `services/` - Business logic
- `schemas/` - Data validation (Pydantic)
- `core/` - Infrastructure (database, security, config)
- `utils/` - Helper functions and constants

#### 2. **Dependency Management**
- `requirements.txt` - Pin all versions
- Dependencies organized by category
- Use virtual environments

#### 3. **Configuration Management**
- `app/core/config.py` - Centralized config
- Environment variables via `.env`
- No hardcoded secrets

#### 4. **Database Layer**
- `app/core/database.py` - Connection management
- Async operations with Motor
- Collection accessors

#### 5. **Security**
- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Request/response validation

#### 6. **Error Handling**
- Proper HTTP status codes
- Consistent error format
- Validation at schema level

#### 7. **Logging & Monitoring**
- Structured logging setup
- Application lifecycle events
- Error tracking

#### 8. **Documentation**
- Docstrings in all functions
- ARCHITECTURE.md guide
- API endpoint documentation (FastAPI auto-docs)

### File Structure
```
backend/
├── app/
│   ├── core/          # Configuration, security, database
│   ├── models/        # (Optional) ORM models if using SQLAlchemy
│   ├── schemas/       # Pydantic models for validation
│   ├── services/      # Business logic
│   ├── routes/        # API endpoints
│   ├── api/           # Router configuration
│   └── utils/         # Helpers and constants
├── tests/             # Unit and integration tests
├── main.py            # Application entry point
├── requirements.txt   # Dependencies
├── .env.example       # Environment template
├── ARCHITECTURE.md    # Documentation
└── README.md          # Project readme
```

---

## Frontend (React/JavaScript)

### ✅ Implemented Standards

#### 1. **Modular Architecture**
- `services/` - API communication
- `context/` - Global state management
- `components/` - Reusable UI components
- `pages/` - Full-page components
- `utils/` - Helper functions
- `constants/` - App-wide constants
- `hooks/` - Custom React hooks

#### 2. **Service Layer**
- `apiClient.js` - Configured HTTP client
- Service files for each domain
- Request/response interceptors
- Automatic token injection

#### 3. **State Management**
- React Context API
- Custom hooks (`useAuth`, `useApp`)
- Local component state with useState
- Effects for side effects

#### 4. **Component Organization**
- Functional components with hooks
- Props validation (JSDoc)
- Reusable UI component library (Shadcn)
- Clear component hierarchy

#### 5. **Utilities & Helpers**
- Formatters (date, currency, phone)
- Validators (email, password, forms)
- Constants (endpoints, messages, configs)
- Type definitions (JSDoc)

#### 6. **Configuration Management**
- `.env.local` - Local environment variables
- `.env.example` - Template with comments
- Runtime configuration from env vars

#### 7. **Error Handling**
- Service layer error handling
- User-friendly error messages
- Automatic redirect on auth failure
- Toast notifications for feedback

#### 8. **Code Quality**
- ESLint ready
- Prettier formatting
- Prop types or JSDoc comments
- Consistent naming conventions

### File Structure
```
frontend/src/
├── components/
│   ├── Layout.jsx
│   ├── *.jsx              # Feature components
│   └── ui/                # Reusable UI components
├── pages/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── *.jsx              # Page components
├── services/
│   ├── index.js
│   ├── apiClient.js       # HTTP client config
│   └── *Service.js        # Domain services
├── context/
│   ├── index.js
│   ├── AuthContext.jsx
│   └── AppContext.jsx     # State management
├── hooks/
│   └── use-*.js           # Custom hooks
├── utils/
│   ├── index.js
│   ├── formatters.js      # Formatting utilities
│   └── validators.js      # Validation utilities
├── constants/
│   ├── index.js
│   ├── api.js             # API endpoints
│   └── app.js             # App constants
├── types/
│   └── index.js           # Type definitions
├── lib/
│   └── utils.js           # UI utilities (cn, etc.)
├── App.jsx                # Main app component
├── index.jsx              # Entry point
├── App.css                # Global styles
├── index.css              # Base styles
├── .env.example           # Environment template
├── ARCHITECTURE.md        # Documentation
└── README.md              # Project readme
```

---

## Common Standards Applied

### 1. **Naming Conventions**

| Item | Convention | Example |
|------|-----------|---------|
| Python Modules | snake_case | `user_service.py` |
| Python Classes | PascalCase | `UserService` |
| Python Functions | snake_case | `create_user()` |
| React Components | PascalCase | `UserProfile.jsx` |
| React Hooks | camelCase with `use` prefix | `useAuth()` |
| React Files | PascalCase for components, camelCase for utils | `UserCard.jsx`, `helpers.js` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Variables | camelCase | `userData` |

### 2. **Code Organization**

**Backend:**
```python
# Imports organized by: stdlib, third-party, local
import os
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.security import get_current_user
from app.schemas.user import User
```

**Frontend:**
```javascript
// Imports organized by: third-party, internal
import React, { useState } from 'react';
import axios from 'axios';

import { useAuth } from '../context';
import { authService } from '../services';
import { Button } from './ui/button';
```

### 3. **Documentation**

**Backend Docstrings:**
```python
def calculate_subscription_status(renewal_date_str: str) -> str:
    """
    Calculate subscription status based on renewal date
    
    Args:
        renewal_date_str: Renewal date in YYYY-MM-DD format
        
    Returns:
        Status string (Upcoming, Active, Expiring Soon, etc)
    """
```

**Frontend JSDoc:**
```javascript
/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  // implementation
};
```

### 4. **Error Handling**

**Backend:**
```python
from fastapi import HTTPException, status

raise HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Email already registered"
)
```

**Frontend:**
```javascript
try {
  const response = await authService.login(email, password);
} catch (error) {
  const message = error.detail || 'Login failed';
  console.error(message);
}
```

### 5. **API Communication**

**Backend:**
- RESTful endpoints with proper HTTP methods
- Consistent endpoint naming: `/api/resource` or `/api/resource/{id}`
- Status codes: 200, 201, 204, 400, 401, 403, 404, 500
- Error format: `{"detail": "error message"}`

**Frontend:**
- Service layer handles all API calls
- Centralized `apiClient` with interceptors
- Constants for endpoints
- Error handling at service level

### 6. **Environment Configuration**

**Backend `.env`:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=subscription_manager
JWT_SECRET_KEY=secret
CORS_ORIGINS=http://localhost:3000
DEBUG=False
```

**Frontend `.env.local`:**
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_DEBUG=false
```

### 7. **Testing**

**Backend:**
```python
# tests/test_auth.py
import pytest
from app.services.user_service import UserService

@pytest.mark.asyncio
async def test_user_creation():
    # Test implementation
    pass
```

**Frontend:**
```javascript
// src/__tests__/utils.test.js
import { formatDate, isValidEmail } from '../utils';

describe('formatDate', () => {
  test('should format date correctly', () => {
    expect(formatDate('2024-01-01')).toBe('Jan 01, 2024');
  });
});
```

---

## Benefits of This Structure

✅ **Scalability** - Easy to add new features without modifying existing code
✅ **Maintainability** - Clear organization makes code easier to understand
✅ **Testability** - Separated concerns are easier to unit test
✅ **Reusability** - Services and utilities can be used across components
✅ **Security** - Centralized security handling in one place
✅ **Performance** - Service layer can implement caching and optimization
✅ **Team Collaboration** - Clear structure helps new developers understand codebase
✅ **Production Ready** - Follows industry best practices

---

## Next Steps

1. **Database Setup**: Create indexes on frequently queried fields
2. **API Documentation**: Generate Swagger/OpenAPI docs
3. **Testing**: Add comprehensive unit and integration tests
4. **CI/CD**: Set up GitHub Actions or GitLab CI
5. **Monitoring**: Add application monitoring and error tracking
6. **Performance**: Implement caching strategies
7. **Security**: Add rate limiting, input sanitization
8. **Deployment**: Containerize with Docker, deploy to cloud

---

**Version**: 1.0
**Last Updated**: December 2024
