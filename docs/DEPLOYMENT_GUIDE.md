# Deployment Guide

This document outlines the steps to deploy the Subscription Manager application.

## Pre-deployment Checklist
- [ ] MongoDB instance is running and accessible.
- [ ] Environment variables are properly configured for production (different secrets, debug=False).
- [ ] Dependencies are locked and up-to-date.

## Environment Configuration

### Backend (`.env`)
Ensure the following variables are set for production:
```ini
DEBUG=False
LOG_LEVEL=INFO
MONGO_URL=mongodb://<user>:<password>@<host>:<port>/<db_name>
JWT_SECRET_KEY=<secure_random_string>
CORS_ORIGINS=https://your-frontend-domain.com
```

### Frontend (`.env` or Build time)
```ini
REACT_APP_API_URL=https://your-backend-api.com
```

## Deployment Steps

### 1. Database
Ensure your MongoDB cluster is provisioned (e.g., MongoDB Atlas or self-hosted).

### 2. Backend Deployment
The backend uses Uvicorn. It is recommended to run it behind a process manager like Gunicorn (with Uvicorn workers) or Supervisor/PM2.

**Using Gunicorn:**
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

**Docker (Backend):**
A `Dockerfile` for the backend typically looks like this:
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
```

### 3. Frontend Deployment
The frontend is built into static files.

**Build:**
```bash
cd frontend
npm install
npm run build
```
The output will be in `frontend/build`.

**Serving:**
Serve the `build` directory using a static file server (Nginx, Apache, S3 + CloudFront, Vercel, Netlify).

**Nginx Configuration Example (Fragment):**
```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /path/to/frontend/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }
}
```
