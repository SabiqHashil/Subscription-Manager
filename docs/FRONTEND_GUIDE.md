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
-   **ui/**: Basic UI primitives (Button, Input, Dialog, Table) powered by Radix UI/Shadcn.
-   **StaffDialog.jsx, SubscriptionDialog.jsx**: Modals for creating/editing resources.
-   **StaffTable.jsx, SubscriptionTable.jsx**: Data grids for displaying lists.

### Pages (`src/pages/`)
-   **Dashboard.jsx**: Charts and summary cards.
-   **Login.jsx**: Authentication screen.
-   **Subscriptions.jsx**: Main view for managing subscriptions.
-   **StaffManagement.jsx**: Admin view for managing users.

### Services (`src/services/`)
-   **apiClient.js**: Axios instance with interceptors for Bearer token injection.
-   **authService.js**: Login/Register API calls.
-   **subscriptionService.js**: CRUD API calls for subscriptions.

### Context (`src/context/`)
-   **AuthContext.jsx**: Manages `user` state and `isAuthenticated` status.
-   **AppContext.jsx**: Global UI state (e.g., sidebar toggle).

## Setup & Installation

### Prerequisites
-   Node.js (v18+ recommended)
-   npm or yarn

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

## Running the Application

To start the development server:

```bash
npm start
# or
yarn start
```
The application will run at `http://localhost:3000`.

## Key Technologies

### UI Framework
-   **React 19**: Uses modern React features (Hooks, Context).
-   **Structure**: Functional components with Hooks.

### Styling
-   **Tailwind CSS**: Utility-first CSS for styling.
-   **Radix UI**: Headless accessible primitives for complex components (Dialogs, Dropdowns, etc.).
-   **Lucide React**: Icon library.

### State Management
-   **Context API**: Used for global state like User Authentication (`AuthContext`) and Theme (`ThemeContext`).

### HTTP Client
-   **Axios**: Configured in `src/services` to make requests to the backend API.
-   Includes interceptors for attaching JWT tokens to requests automatically.

### Form Handling
-   **React Hook Form**: Manages form state and validation.
-   **Zod**: Schema validation library used with React Hook Form.

## Environment Variables
The frontend uses environment variables defined in `.env`:
-   `REACT_APP_API_URL`: Base URL for the backend API.

## Building for Production

To create an optimized production build:

```bash
npm run build
```
This output is generated in the `build/` folder.
