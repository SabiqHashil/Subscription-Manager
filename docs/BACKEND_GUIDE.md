# Backend Development Guide

This guide provides detailed information about the Python/FastAPI backend for the Subscription Manager.

## Project Structure

The backend code is located in the `/backend` directory.

```
backend/
├── app/
│   ├── api/            # API Router configuration
│   ├── core/           # Core config (DB, Security, Logging)
│   ├── models/         # Pydantic models / DB models
│   ├── routes/         # Endpoint implementations
│   ├── schemas/        # Pydantic Schemas for Request/Response
│   ├── services/       # Business logic layer
│   └── utils/          # Utility functions
├── main.py             # Application entry point
├── server.py           # Alternative/Legacy entry point
├── requirements.txt    # Python dependencies
├── .env                # Environment variables
└── .env.example        # Example environment variables
```

## Module Descriptions

### Core (`app/core/`)
-   **config.py**: Centralized configuration (DB URL, JWT Secret, CORS, Logging).
-   **database.py**: MongoDB connection management via Motor.
-   **security.py**: JWT implementation, password hashing, and authentication middleware.

### Schemas (`app/schemas/`)
-   **user.py**: Pydantic models for User, UserCreate, LoginRequest, etc.
-   **subscription.py**: Models for Subscription data and Dashboard stats.

### Services (`app/services/`)
-   **user_service.py**: Handles user CRUD, password verification, and user management logic.
-   **subscription_service.py**: Logic for subscription creation, updates, and renewal calculations.

### Routes (`app/routes/`)
-   **auth.py**: Login (`/login`), Register (`/register`), and Me (`/me`) endpoints.
-   **staff.py**: Admin endpoints for managing staff users.
-   **subscriptions.py**: Endpoints for CRUD operations on subscriptions.
-   **dashboard.py**: Aggregated statistics for the dashboard view.

### Utils (`app/utils/`)
-   **constants.py**: Enums for User Roles, Subscription Categories, etc.
-   **helpers.py**: Date formatting, status calculation logic.

## Setup & Installation

### Prerequisites
-   Python 3.10+
-   MongoDB running locally or accessible via URL.

### Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3.  Activate the virtual environment:
    -   **Windows**: `venv\Scripts\activate`
    -   **Unix/MacOS**: `source venv/bin/activate`

4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5.  Configure Environment:
    -   Copy `.env.example` to `.env`.
    -   Update the values in `.env` (MongoDB URL, Secret Key, etc.).

## Running the Application

To start the server using Uvicorn:

```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.
Documentation (Swagger UI) is available at `http://localhost:8000/docs`.

## Key Components

### Entry Point (`main.py`)
Configures the FastAPI app, middleware (CORS), logging, and includes the API router. It also defines the startup/shutdown lifecycle events (connecting/disconnecting DB).

### Database Schema
The application uses MongoDB (NoSQL). Key collections typically include:
-   **users**: `_id`, `name`, `email`, `password_hash`, `role` (admin/staff).
-   **subscriptions**: `_id`, `client_name`, `price`, `renewal_date`, `status` (Active/Expired).

## Testing
Run tests using `pytest`:
```bash
pytest
```
