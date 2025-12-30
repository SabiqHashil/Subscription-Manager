# Frontend Project Structure Guide

## Overview

The frontend is reorganized into a scalable React architecture with clear separation of concerns.

## Directory Structure

```
frontend/src/
├── components/
│   ├── Layout.jsx              # Main layout wrapper
│   ├── StaffDialog.jsx         # Staff management dialog
│   ├── StaffTable.jsx          # Staff table display
│   ├── SubscriptionDialog.jsx  # Subscription dialog
│   ├── SubscriptionTable.jsx   # Subscription table
│   └── ui/                     # Reusable UI components
│       ├── button.jsx
│       ├── dialog.jsx
│       ├── form.jsx
│       ├── input.jsx
│       ├── table.jsx
│       └── ... (other UI components)
├── pages/
│   ├── Dashboard.jsx           # Dashboard page
│   ├── Login.jsx              # Login page
│   ├── StaffManagement.jsx    # Staff management page
│   └── Subscriptions.jsx      # Subscriptions page
├── services/
│   ├── index.js               # Service exports
│   ├── apiClient.js           # Axios configuration
│   ├── authService.js         # Auth API calls
│   ├── staffService.js        # Staff API calls
│   ├── subscriptionService.js # Subscription API calls
│   └── dashboardService.js    # Dashboard API calls
├── context/
│   ├── index.js               # Context exports
│   ├── AuthContext.jsx        # Auth state management
│   └── AppContext.jsx         # App global state
├── hooks/
│   └── use-toast.js           # Toast notification hook
├── utils/
│   ├── index.js               # Utils exports
│   ├── formatters.js          # Formatting functions
│   └── validators.js          # Validation functions
├── constants/
│   ├── index.js               # Constants exports
│   ├── api.js                 # API endpoints
│   └── app.js                 # App constants
├── types/
│   └── index.js               # TypeScript-like type definitions
├── lib/
│   └── utils.js               # UI utility functions (cn)
├── App.js                     # Main app component
├── index.js                   # Entry point
├── App.css                    # Global styles
└── index.css                  # Global CSS
```

## Module Descriptions

### Components (`src/components/`)

Reusable React components:

- **Layout.jsx**: Main application layout with sidebar/header
- **StaffDialog.jsx**: Modal for creating/editing staff
- **StaffTable.jsx**: Table display for staff list
- **SubscriptionDialog.jsx**: Modal for subscription management
- **SubscriptionTable.jsx**: Table display for subscriptions
- **ui/**: Shadcn UI components (button, dialog, form, input, table, etc.)

### Pages (`src/pages/`)

Full-page components representing routes:

- **Dashboard.jsx**: Main dashboard with statistics
- **Login.jsx**: User login page
- **StaffManagement.jsx**: Staff management page (admin only)
- **Subscriptions.jsx**: Subscriptions listing and management

### Services (`src/services/`)

API communication layer:

- **apiClient.js**: Configured axios instance with interceptors
- **authService.js**: Authentication endpoints
- **staffService.js**: Staff management endpoints
- **subscriptionService.js**: Subscription endpoints
- **dashboardService.js**: Dashboard statistics endpoints

**Key Features:**
- Request/response interceptors
- Automatic token attachment
- Error handling
- Base URL configuration

### Context (`src/context/`)

Global state management:

- **AuthContext.jsx**: User authentication state
  - `useAuth()` hook for auth operations
  - Login, logout, user data management
  - Token persistence

- **AppContext.jsx**: Application-wide state
  - `useApp()` hook for app operations
  - Sidebar toggle, theme management
  - Global UI state

### Utils (`src/utils/`)

Utility functions:

- **formatters.js**: Date, currency, phone formatting
- **validators.js**: Input validation functions
- **Helpers for**: Email validation, password strength, date ranges

### Constants (`src/constants/`)

Application-wide constants:

- **api.js**: API endpoints, user roles, subscription types/categories
- **app.js**: App name, storage keys, messages, notifications
- **types/**: Type definitions (JSDoc-style)

## Architecture Patterns

### 1. Hooks-Based State Management

```javascript
// Using context hooks
const { user, isAuthenticated, login, logout } = useAuth();
const { isSidebarOpen, toggleSidebar } = useApp();
```

### 2. Service Layer for API Calls

```javascript
// Service handles API logic
const response = await authService.login(email, password);
const subscriptions = await subscriptionService.getAll();
```

### 3. Component Composition

```javascript
// Pages use services and context
function SubscriptionsPage() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const data = await subscriptionService.getAll();
      setSubscriptions(data);
    };
    loadData();
  }, []);
  
  return <SubscriptionTable data={subscriptions} />;
}
```

### 4. Reusable UI Components

```javascript
// Using shadcn UI components
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Table, TableBody, TableCell } from './ui/table';
```

## Running the Application

### Install Dependencies

```bash
npm install
```

### Create `.env.local` file

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_DEBUG=false
```

### Start Development Server

```bash
npm start
```

Access at: http://localhost:3000

### Build for Production

```bash
npm run build
```

## Key Features

### Authentication Flow

1. User enters credentials on Login page
2. `authService.login()` sends request to backend
3. Token stored in localStorage
4. `AuthContext` updated with user and token
5. `ProtectedRoute` redirects to Dashboard
6. `apiClient` automatically includes token in requests

### API Communication

1. Service calls `apiClient.post/get/put/delete()`
2. Request interceptor adds Bearer token
3. Response interceptor handles 401 errors
4. Error handling with user-friendly messages
5. Automatic redirect to login on authentication failure

### State Management Flow

```
User Action
    ↓
Service Call (API)
    ↓
Context Update (useAuth/useApp)
    ↓
Component Re-render
    ↓
UI Update
```

## File Organization Best Practices

### 1. Import Organization

```javascript
// Third-party imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Internal imports
import { useAuth } from '../context';
import { subscriptionService } from '../services';
import { formatDate } from '../utils';
import { API_ENDPOINTS } from '../constants';
import { Button } from './ui/button';
```

### 2. Component Structure

```javascript
function ComponentName() {
  // Hooks
  const { user } = useAuth();
  const [data, setData] = useState(null);
  
  // Effects
  useEffect(() => {
    loadData();
  }, []);
  
  // Handlers
  const handleAction = async () => {
    // implementation
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### 3. Service Usage Pattern

```javascript
// Service
export const subscriptionService = {
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS_LIST);
  },
};

// Component
const [subscriptions, setSubscriptions] = useState([]);

useEffect(() => {
  subscriptionService.getAll().then(setSubscriptions);
}, []);
```

## Integration with Backend

### Base URL Configuration

```javascript
// .env.local
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### API Client Setup

```javascript
// services/apiClient.js
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

// Automatic Bearer token injection
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Common Tasks

### Adding a New Page

1. Create component in `src/pages/ComponentName.jsx`
2. Create service methods in `src/services/`
3. Use context hooks for state
4. Import UI components from `src/components/ui/`
5. Add route in App.js

### Adding API Functionality

1. Create service in `src/services/newService.js`
2. Add endpoint to `src/constants/api.js`
3. Export from `src/services/index.js`
4. Use in components via `useEffect` and state

### Formatting Data

```javascript
import { formatDate, formatCurrency, getStatusColor } from '../utils';

// In component
<span className={getStatusColor(status)}>{status}</span>
<p>{formatDate(date)}</p>
<p>{formatCurrency(price)}</p>
```

### Form Validation

```javascript
import { validateSubscriptionData, isValidEmail } from '../utils';

const handleSubmit = (data) => {
  const { isValid, errors } = validateSubscriptionData(data);
  if (!isValid) {
    // Show errors
    return;
  }
  // Submit form
};
```

## Performance Optimization

### Code Splitting (if using React Router)

```javascript
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

### Memoization

```javascript
import { memo, useMemo } from 'react';

const Component = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);
  
  return <div>{/* render */}</div>;
});
```

### API Response Caching

Consider adding caching to services for repeated requests.

## Troubleshooting

### API Connection Issues

- Check `REACT_APP_API_BASE_URL` in `.env.local`
- Verify backend is running on the correct port
- Check CORS configuration in backend

### Authentication Issues

- Check token storage in localStorage
- Verify JWT token format
- Check token expiration

### Component Not Updating

- Verify context provider wraps component
- Check dependency arrays in useEffect
- Use React DevTools to debug state

## Best Practices Implemented

✅ **Modular Components**: Reusable, single-responsibility components
✅ **Custom Hooks**: `useAuth()` and `useApp()` for state access
✅ **Service Layer**: Centralized API communication
✅ **Constants Management**: Centralized configuration
✅ **Error Handling**: User-friendly error messages
✅ **Type Safety**: JSDoc type definitions
✅ **Code Organization**: Clear folder structure
✅ **Responsive Design**: Mobile-friendly UI
✅ **Accessibility**: ARIA labels and semantic HTML
✅ **Performance**: Lazy loading and memoization

## Contributing

1. Follow the existing folder structure
2. Use meaningful component names
3. Add prop types or JSDoc comments
4. Test components before committing
5. Update this document for new patterns
