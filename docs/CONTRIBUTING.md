# Contributing Guide

Thank you for considering contributing to the Subscription Manager project!

## Development Workflow

1.  **Fork** the repository.
2.  **Clone** your fork locally.
3.  Create a **new branch** for your feature or bugfix (`git checkout -b feature/amazing-feature`).
4.  Commit your changes (`git commit -m "Add amazing feature"`).
5.  Push to the branch (`git push origin feature/amazing-feature`).
6.  Open a **Pull Request**.

## Coding Standards

### General
-   Write clean, readable, and self-documenting code.
-   Add comments for complex logic.
-   Ensure no sensitive data (API keys, secrets) is committed.

### Backend (Python/FastAPI)
-   Follow **PEP 8** style guidelines.
-   Use **Type Hints** for function arguments and return values.
-   Use **Pydantic** models for data validation.
-   Organize imports: Standard library -> Third party -> Local application.
-   Run formatters/linters (e.g., `black`, `flake8`) before committing.

### Frontend (React)
-   Use **Functional Components** and **Hooks**.
-   Avoid large components; break them down into smaller, reusable ones.
-   Use **Tailwind CSS** for styling; avoid inline styles.
-   Follow the folder structure (components, hooks, services).
-   Use descriptive variable and function names.

## Testing

-   **Backend**: Run `pytest` to ensure all tests pass. Add new tests for new features.
-   **Frontend**: Run `npm test` (if available) or verify UI changes manually across different screen sizes.

## Pull Request Process

1.  Describe the changes in detail.
2.  Link to any related issues.
3.  Include screenshots for UI changes.
4.  Ensure the build passes and no linting errors exist.
