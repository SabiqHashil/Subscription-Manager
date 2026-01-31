# Frontend Development Guide

This guide details the React frontend architecture for the Subscription Manager.

## Project Structure

The frontend code is located in the `/frontend` directory.

```
frontend/
├── public/             # Static assets (HTML, Favicon)
├── src/
│   ├── components/     # Reusable UI components
│   ├── constants/      # App-wide constants
│   ├── context/        # React Context (Auth, Theme)
│   ├── hooks/          # Custom React Hooks
│   ├── lib/            # Utilities (clsx, tw-merge)
│   ├── pages/          # Page components (Route targets)
│   ├── services/       # API integration (Axios)
│   ├── types/          # TypeScript types (if applicable)
│   ├── utils/          # Helper functions
│   ├── App.js          # Root component
│   └── index.js        # Entry point
├── package.json        # Dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

## Module Descriptions

### Components (`src/components/`)
-   **Layout.jsx**: App shell containing the Sidebar and Header.
-   **ui/**: Basic UI primitives powered by Radix UI/Shadcn.
-   **StaffDialog.jsx**: Modal for viewing/creating/editing staff. Now includes detailed view with timestamps.
-   **StaffTable.jsx**: Updated data grid focusing on Name, Email, Phone, and Level.

### Pages (`src/pages/`)
-   **Dashboard.jsx**: Analytics and summary cards.
-   **Subscriptions.jsx**: Main subscription management board.
-   **StaffManagement.jsx**: Admin dashboard for staff permissions.

### Services (`src/services/`)
-   **apiClient.js**: Global Axios instance with JWT interceptors.
-   **authService.js**: Login and Profile update API integration.

## Setup & Installation

### Prerequisites
-   Node.js (v18+)
-   npm or yarn

### Installation
1.  Navigate to `/frontend`.
2.  Install dependencies: `npm install`.

## Running the Application
To start the development server: `npm start`.
The application runs at `http://localhost:3000` and connects to the Node.js backend on port `8000`.

## Key Technologies
-   **React 19**: Modern hook-based architecture.
-   **Tailwind CSS**: Responsive utility styling.
-   **Radix UI**: Accessible UI primitives.
-   **Zod**: Schema validation for forms.

## Environment Variables
-   `REACT_APP_BACKEND_URL`: Base URL for the Node.js backend API.
