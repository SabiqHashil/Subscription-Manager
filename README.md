# Subscription Manager - Full Stack Application

A production-ready full-stack subscription management system built with **FastAPI** (backend) and **React** (frontend), following industry best practices and coding standards.

## 📋 Project Overview

This application helps businesses manage their subscriptions efficiently with:

- **User Management**: Admin and staff roles with secure authentication
- **Subscription Tracking**: Monitor client subscriptions with renewal dates
- **Dashboard Analytics**: Real-time statistics on subscriptions status
- **Admin Controls**: Staff management and subscription CRUD operations
- **Role-Based Access**: Different permissions for admin and staff users

## 🏗️ Architecture

The project is organized into two main modules with clear separation of concerns:

### Backend (FastAPI + MongoDB)
```
backend/
├── app/
│   ├── core/        # Configuration, security, database
│   ├── schemas/     # Pydantic models for validation
│   ├── services/    # Business logic
│   ├── routes/      # API endpoints
│   └── utils/       # Helpers and constants
├── main.py          # Application entry point
└── requirements.txt # Dependencies
```

### Frontend (React)
```
frontend/src/
├── services/        # API communication
├── context/         # Global state management
├── pages/           # Full-page components
├── components/      # Reusable UI components
├── utils/           # Helper functions
├── constants/       # App-wide constants
└── hooks/           # Custom hooks
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** (for backend)
- **Node.js 16+** (for frontend)
- **MongoDB 4.0+** (database)
- **Git** (version control)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run application:**
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   **API Documentation:** http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   # Update with your backend URL
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

   **Application:** http://localhost:3000

## 📚 Documentation

### Complete Architecture Guides

- **[Backend Architecture](backend/ARCHITECTURE.md)** - Backend structure, patterns, and best practices
- **[Frontend Architecture](frontend/ARCHITECTURE.md)** - Frontend structure, state management, and conventions
- **[Project Standards](PROJECT_STANDARDS.md)** - Coding standards, naming conventions, and best practices

### Migration Guides

- **[Backend Migration Guide](backend/MIGRATION_GUIDE.md)** - Migrating from monolithic to modular structure
- **[Frontend Migration Guide](frontend/MIGRATION_GUIDE.md)** - Reorganization and new patterns

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login          # Login user
POST   /api/auth/register       # Register user (admin only)
GET    /api/auth/me             # Get current user
```

### Staff Management (Admin Only)
```
GET    /api/staff               # Get all staff
GET    /api/staff/{staff_id}    # Get staff by ID
PUT    /api/staff/{staff_id}    # Update staff
DELETE /api/staff/{staff_id}    # Delete staff
```

### Subscriptions
```
GET    /api/subscriptions                # Get all subscriptions
POST   /api/subscriptions                # Create subscription
GET    /api/subscriptions/{id}           # Get subscription
PUT    /api/subscriptions/{id}           # Update subscription
DELETE /api/subscriptions/{id}           # Delete subscription
```

### Dashboard (Admin Only)
```
GET    /api/dashboard/stats     # Get statistics
```

## 🔐 Default Credentials

After first run, default admin user is created:

```
Email: admin@subscriptionmanager.com
Password: admin123
```

⚠️ **Change these credentials in production!**

## ✨ Key Features

### Backend
✅ **Modular Architecture** - Organized into services, routes, schemas, and core modules
✅ **Security** - JWT authentication, password hashing, role-based authorization
✅ **Async Operations** - Asynchronous database operations with Motor
✅ **Validation** - Pydantic models for request/response validation
✅ **Error Handling** - Consistent error responses with proper HTTP status codes
✅ **Auto Documentation** - Swagger UI and ReDoc for API documentation
✅ **CORS Support** - Configurable CORS for frontend integration
✅ **Logging** - Structured logging for debugging and monitoring

### Frontend
✅ **Component-Based** - Reusable, composable React components
✅ **State Management** - Context API with custom hooks for global state
✅ **Service Layer** - Centralized API communication with interceptors
✅ **Form Validation** - Client-side validation with helpful error messages
✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS and Shadcn
✅ **Authentication** - Secure JWT-based authentication flow
✅ **Error Handling** - Graceful error handling with user feedback
✅ **Type Safety** - JSDoc type annotations for better IDE support

## 🔒 Security Features

- **Password Hashing** - BCrypt with salt
- **JWT Tokens** - Secure token-based authentication
- **CORS Protection** - Configurable cross-origin access
- **Role-Based Access** - Admin and staff roles
- **Environment Variables** - No hardcoded secrets
- **Automatic Logout** - On token expiration
- **Request Validation** - Pydantic schema validation

## 📝 Code Standards

### Naming Conventions
- **Python**: `snake_case` for functions/variables, `PascalCase` for classes
- **JavaScript**: `camelCase` for functions/variables, `PascalCase` for components
- **Constants**: `UPPER_SNAKE_CASE`

### Documentation
- **Backend**: Docstrings for all functions and classes
- **Frontend**: JSDoc comments for utilities and components
- **Comments**: Explain "why", not "what"

---

**Project Status**: ✅ Production Ready

**Last Updated**: December 2024

**Documentation Version**: 1.0