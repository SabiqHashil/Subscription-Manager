# Contributing Guide

## Development Workflow

1.  **Fork** and **Clone** the repository.
2.  Create a **feature branch** (`feature/your-feature`).
3.  Commit changes and open a **Pull Request**.

## Coding Standards

### Backend (Node.js/Express)
-   Use **ES6+** syntax.
-   Follow **standard.js** or Clean Code principles.
-   Use **Mongoose** models for data structuring.
-   Maintain consistency with existing error handling and middleware patterns.
-   Ensure all endpoints are secured via the `auth` middleware unless public.

### Frontend (React)
-   Use **Functional Components** and **Hooks**.
-   Prioritize **Tailwind CSS** for styling.
-   Implement responsive designs using mobile-first approach.
-   Break down complex components into atomic parts.

## Testing
-   **Backend**: Verify API responses using tools like Postman or `curl`.
-   **Frontend**: Manual verification and build checks.
