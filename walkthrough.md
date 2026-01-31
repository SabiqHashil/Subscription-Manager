# Walkthrough - Staff Access Levels

## Changes Applied

### 1. Granular Staff Permissions
- **Backend**: Updated `User` schema and service to store `access_level` ("full" or "view_only").
- **Frontend**:
    - **Staff Dialog**: Added "Access Level" dropdown (Full Access / View Only).
    - **Sidebar**: Hides "Staff Management" for View Only users.
    - **Subscriptions Page**: Hides "Add Subscription", "Edit", and "Delete" buttons for View Only users.

## Verification

### Manual Verification
1.  **Login as Admin**.
2.  **Create New Staff**:
    - Name: `View Staff`
    - Email: `view@test.com`
    - Access Level: **View Only**
3.  **Logout** and **Login as `view@test.com`**.
4.  **Checks**:
    - [ ] "Staff" link should be **missing** from sidebar.
    - [ ] "Add Subscription" button should be **missing**.
    - [ ] "Actions" column (Edit/Delete) should be **missing** or show only "Eye" icon.
