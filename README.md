# Subscription Manager

The **Subscription Manager** is a modern, full-stack web application designed to help users track their recurring subscriptions, monitor expenses, and manage renewal dates effectively.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Documentation

Detailed documentation is available in the `docs/` folder:

-   [**System Architecture**](docs/SYSTEM_ARCHITECTURE.md) - High-level design and data flow.
-   [**Backend Guide**](docs/BACKEND_GUIDE.md) - API, Database, and Node.js/Express setup.
-   [**Frontend Guide**](docs/FRONTEND_GUIDE.md) - React, Tailwind, and UI components.
-   [**Deployment Guide**](docs/DEPLOYMENT_GUIDE.md) - Production build and environment configuration.
-   [**Contributing**](docs/CONTRIBUTING.md) - Guidelines for developers.
-   [**Migration Report**](BACKEND_MIGRATION.md) - Details on the Python to Node.js transition.

---

## 🚀 Quick Start

### Prerequisites
-   **Node.js** (v18+)
-   **MongoDB** (Local or Atlas URI)

### 1. Backend Setup (Node.js)

```bash
cd backend-node
npm install
# Configure your .env file
npm run dev
```

### 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Access the app at `http://localhost:3000`.

---

## 🛠 Tech Stack

### Frontend
-   **React 19**: Modern UI library with Hooks and Context.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Radix UI**: Accessible headless UI primitives.
-   **Axios**: HTTP client for API communication.

### Backend
-   **Node.js & Express**: Fast, unopinionated, minimalist web framework.
-   **MongoDB & Mongoose**: NoSQL database with elegant object modeling.
-   **JWT & Bcryptjs**: Secure authentication and password hashing.
-   **Helmet & Morgan**: Security headers and request logging.

---

## 📂 Project Structure

```
/
├── backend-node/       # Active Backend (Node.js/Express)
├── backend-python/     # Legacy Backend (Python/FastAPI)
├── frontend/           # Client-side code (React)
├── docs/               # Detailed documentation
└── README.md           # Project overview
```

## ✨ Key Features

-   **Dashboard**: Overview of monthly expenses and upcoming renewals.
-   **Subscription Tracking**: Add, edit, and delete detailed subscription info.
-   **Staff Management**: Manage assistant accounts with tiered access levels (Viewer/Admin).
-   **Profile Control**: Users can update their own security details and contact info.
-   **Responsive Design**: Works seamlessly on desktop and mobile.

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License.