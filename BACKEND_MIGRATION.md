# Backend Migration Guide: Python (FastAPI) to Node.js (Express)

This document outlines the changes and steps to switch from the existing Python backend to the new Node.js backend.

## Overview
The backend has been ported from Python (FastAPI) to Node.js (Express) while maintaining strictly identical logic, database schema, and API endpoints. The React frontend requires **zero changes** to work with the new backend.

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Running locally or as per config)

## 1. Setup New Backend
The project has been reorganized. The original Python backend is now in `backend-python`, and the new primary backend is in `backend-node`.

1.  Navigate to the folder:
    ```bash
    cd backend-node
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Verify Environment Variables:
    - A `.env` file has been created.
    - Ensure `MONGO_URL` points to your running instance.
    - Ensure `PORT` is set to `8000` (matches the Python backend).

## 2. Running the Server

### Development Mode
```bash
npm run dev
```
Runs with `nodemon` for auto-restart on changes.

### Production Mode
```bash
npm start
```

## 3. Stopping the Old Backend (Legacy)
The legacy Python backend has been moved to `backend-python`. If it was already running, you **MUST** kill the process (python.exe) before starting the Node.js backend to free up port `8000`.

## 4. Implementation details
### Folder Structure
| Python (`backend-python/`) | Node.js (`backend-node/`) | Description |
| ------------------- | ------------------------- | ----------- |
| `main.py` | `server.js` | App entry point and config |
| `app/api/endpoints` | `routes/` | API Route definitions |
| `app/schemas` | `models/` | Data models (Mongoose) |
| `app/services` | `routes/` + `models/` | Business logic |
| `app/core` | `middleware/` + `.env` | Config, Auth, Security |

### Key Modules & Enhancements
- **Refined Staff Management**:
    - **Detail View**: Admins can now view a comprehensive profile of any staff member, including Phone, Access Level, Created Date, and Last Updated Date.
    - **Timestamps**: Added `updated_at` functionality to track the last activity on user profiles.
- **Authentication**: Uses `bcryptjs` for password hashing and `jsonwebtoken` for JWTs.
- **Dynamic Admin Sync**: The server automatically creates or updates the default admin based on `.env` (recognizing the user by role to prevent duplicates if the email is changed in the UI).
- **Utils**: `calculate_subscription_status` logic has been replicated to ensure status updates match exactly.

## 5. Verification
1.  Start MongoDB.
2.  Start `backend-node` (`npm start`).
3.  Start Frontend (`npm start` in `frontend` folder).
4.  Login with existing admin credentials.
5.  Verify Dashboard stats and Subscription lists load correctly.
