# Backend Development Guide (Node.js/Express)

This guide provides detailed information about the Node.js/Express backend for the Subscription Manager.

## Project Structure

The backend code is located in the `/backend-node` directory.

```
backend-node/
├── models/             # Mongoose schemas (User, Subscription)
├── routes/             # API endpoint definitions (auth, subscriptions, etc.)
├── middleware/         # Custom middleware (auth, adminOnly)
├── utils/              # Utility functions and helpers
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── server.js           # Application entry point
```

## Module Descriptions

### Models (`models/`)
-   **User.js**: Mongoose schema for User data, including password hashing and role-based access levels.
-   **Subscription.js**: Mongoose schema for Subscription details and status tracking.

### Routes (`routes/`)
-   **authRoutes.js**: Handles user authentication, registration (admin-only), and profile updates.
-   **subscriptionRoutes.js**: CRUD operations for client subscriptions with automatic status calculation.
-   **staffRoutes.js**: Admin-only routes for managing staff accounts.
-   **dashboardRoutes.js**: Exposes statistics for the dashboard view.

### Middleware (`middleware/`)
-   **auth.js**: JWT verification and Role-Based Access Control (RBAC).

### Utilities (`utils/`)
-   **helpers.py**: Date logic, UUID generation, and status calculation to mirror the original Python business logic.

## Setup & Installation

### Prerequisites
-   Node.js (v18+)
-   MongoDB running locally or accessible via URL.

### Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend-node
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    -   Copies `.env.example` to `.env` (if applicable) or create one.
    -   Update `MONGO_URL`, `DB_NAME`, `JWT_SECRET_KEY`, and `PORT`.

## Running the Application

To start the server in development mode (with auto-reload):

```bash
npm run dev
```

The API will be available at `http://localhost:8000`.

## Key Features

### Entry Point (`server.js`)
Configures Express, middleware (CORS, Helmet, Morgan), and establishes a connection to MongoDB using Mongoose. It also triggers the default admin setup logic.

### Database
The application uses MongoDB via Mongoose ORM.
-   **Collections**: `users`, `subscriptions`.
-   **Timestamps**: `created_at` and `updated_at` are managed as ISO strings to maintain compatibility.

### Security
-   **Authentication**: JWT (JSON Web Tokens).
-   **Password Hashing**: Bcryptjs (10 rounds).
-   **Protection**: Helmet and CORS.
