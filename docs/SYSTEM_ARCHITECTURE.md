# System Architecture

## Overview
The **Subscription Manager** is a full-stack web application designed to help users track and manage their subscriptions. It features a modern, responsive frontend built with React and a robust backend API built with FastAPI and MongoDB.

## High-Level Architecture

The system follows a standard **Client-Server Architecture**:

```mermaid
graph TD
    Client[React Frontend] <-->|REST API| Server[FastAPI Backend]
    Server <-->|Database Driver| DB[(MongoDB)]
```

### Components

1.  **Frontend (Client)**
    *   **Framework**: React 19
    *   **Styling**: Tailwind CSS + Radix UI
    *   **State Management**: React Context / Hooks
    *   **Communication**: Axios (HTTP Requests)
    *   **Responsibility**: UI rendering, user interaction, form validation, state management.

2.  **Backend (Server)**
    *   **Framework**: FastAPI (Python)
    *   **Runtime**: Python 3.x / Uvicorn (ASGI)
    *   **Responsibility**: API endpoints, authentication, business logic, data validation, database interaction.

3.  **Database**
    *   **System**: MongoDB
    *   **Driver**: Motor (AsyncIO)
    *   **Responsibility**: Persistent storage of users, subscriptions, and related data.

## Technology Stack

### Frontend
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core** | React 19 | UI Library |
| **Routing** | React Router v7 | Client-side routing |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | Radix UI | Accessible headless UI primitives |
| **Icons** | Lucide React | Iconography |
| **Form Handling** | React Hook Form + Zod | Form state and validation |
| **HTTP Client** | Axios | API requests |
| **Build Tool** | CRA / Craco | Application bundling and configuration |

### Backend
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | FastAPI | High-performance web framework |
| **Server** | Uvicorn | ASGI Server |
| **Database** | MongoDB | NoSQL Database |
| **ODM / Driver** | Motor | Asynchronous MongoDB driver |
| **Authentication** | PyJWT / Passlib | JWT generation and password hashing |
| **Validation** | Pydantic | Data validation and settings management |
| **Environment** | Python-dotenv | Environment variable management |

## Data Flow

1.  **User Interaction**: User interacts with the UI (e.g., "Add Subscription").
2.  **Request**: Frontend sends an HTTP POST request to the Backend (e.g., `POST /api/subscriptions`).
3.  **Validation**: FastAPI/Pydantic validates the request body.
4.  **Processing**: The backend service layer processes the logic.
5.  **Database**: The backend interacts with MongoDB via Motor to store the data.
6.  **Response**: The backend sends a JSON response back to the Frontend.
7.  **Update**: The Frontend updates the UI state based on the response.

## Security

-   **Authentication**: JWT (JSON Web Tokens) for stateless authentication.
-   **Password Storage**: Bcrypt hashing (via Passlib).
-   **CORS**: Configured to restrict access to trusted origins.
-   **Validation**: Strict input validation using Zod (Frontend) and Pydantic (Backend).
