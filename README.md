# Subscription Manager

The **Subscription Manager** is a modern, full-stack web application designed to help users track their recurring subscriptions, monitor expenses, and manage renewal dates effectively.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Documentation

Detailed documentation is available in the `docs/` folder:

-   [**System Architecture**](docs/SYSTEM_ARCHITECTURE.md) - High-level design and data flow.
-   [**Backend Guide**](docs/BACKEND_GUIDE.md) - API, Database, and Python/FastAPI setup.
-   [**Frontend Guide**](docs/FRONTEND_GUIDE.md) - React, Tailwind, and UI components.
-   [**Deployment Guide**](docs/DEPLOYMENT_GUIDE.md) - Production build and environment configuration.
-   [**Contributing**](docs/CONTRIBUTING.md) - Guidelines for developers.

---

## 🚀 Quick Start

### Prerequisites
-   **Node.js** (v18+)
-   **Python** (v3.10+)
-   **MongoDB** (Local or AtlasURI)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB URL
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Access the app at `http://localhost:3000` and the API docs at `http://localhost:8000/docs`.

---

## 🛠 Tech Stack

### Frontend
-   **React 19**: A JavaScript library for building user interfaces.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **Radix UI**: Unstyled, accessible components for building high-quality design systems.
-   **React Router Dom**: Declarative routing for React web applications.
-   **React Hook Form + Zod**: Performant, flexible and extensible forms with easy-to-use validation.

### Backend
-   **FastAPI**: A modern, fast (high-performance), web framework for building APIs with Python 3.
-   **MongoDB**: A source-available cross-platform document-oriented database program.
-   **Motor**: Asynchronous Python driver for MongoDB.
-   **Pydantic**: Data validation and settings management using python type annotations.

---

## 📂 Project Structure

```
/
├── backend/            # Server-side code (Python/FastAPI)
│   ├── app/            # Application logic (Routes, Models, Services)
│   ├── main.py         # Entry point
│   └── requirements.txt
│
├── frontend/           # Client-side code (React)
│   ├── src/            # Components, Pages, Hooks
│   ├── public/         # Static assets
│   └── package.json
│
├── docs/               # Detailed documentation
└── README.md           # Project overview (this file)
```

## ✨ Key Features

-   **Dashboard**: Overview of monthly expenses and upcoming renewals.
-   **Subscription Tracking**: Add, edit, and delete detailed subscription info.
-   **Categories**: Organize subscriptions by category (Entertainment, Utilities, etc.).
-   **Alerts**: Get notified before a subscription renews (planned feature).
-   **Responsive Design**: Works seamlessly on desktop and mobile.

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](docs/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.