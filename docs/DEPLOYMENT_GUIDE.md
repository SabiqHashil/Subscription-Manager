# Deployment Guide

This document outlines the steps to deploy the Subscription Manager application.

## Pre-deployment Checklist
- [ ] MongoDB instance is running and accessible.
- [ ] Environment variables are properly configured for production (different secrets, DEBUG=false).
- [ ] Node.js and npm installed on the target server.

## Environment Configuration

### Backend (`.env`)
Ensure the following variables are set for production:
```ini
DEBUG=false
MONGO_URL=mongodb://<user>:<password>@<host>:<port>/<db_name>
JWT_SECRET_KEY=<secure_random_string>
PORT=8000
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<secure_password>
CORS_ORIGINS=https://your-frontend-domain.com
```

### Frontend (`.env` or Build time)
```ini
REACT_APP_BACKEND_URL=https://your-backend-api.com
```

## Deployment Steps

### 1. Database
Ensure your MongoDB cluster is provisioned (e.g., MongoDB Atlas or self-hosted).

### 2. Backend Deployment
The backend uses Express. It is recommended to use a process manager like **PM2** to keep the application running.

**Using PM2:**
```bash
cd backend-node
npm install --production
pm2 start server.js --name "subscription-manager-backend"
```

**Docker (Backend):**
```dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["node", "server.js"]
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
Serve the `build` directory using a static file server (Nginx, Vercel, Netlify, S3).

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
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
