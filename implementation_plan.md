# Implementation Plan - Profile Page & Password Update

## Goal
Implement a **Profile Page** where logged-in users (Admin/Staff) can:
1.  View their personal details (Name, Email, Phone).
2.  Edit their details (Name, Phone).
3.  Update their password (requires New Password + Confirmation).
4.  Ensure Admin has a "View" option in Staff List to see full details of other staff.

## Proposed Changes

### Backend
#### [MODIFY] [auth.py](file:///d:/PROJECTS/Subscription-Manager/backend/app/routes/auth.py)
- Add `PUT /auth/me` endpoint:
    - Accepts `UserUpdate` schema.
    - Uses `UserService.update_user` with `current_user.id`.

### Frontend
#### [NEW] [Profile.jsx](file:///d:/PROJECTS/Subscription-Manager/frontend/src/pages/Profile.jsx)
- **View Mode**: Displays info cards.
- **Edit Mode**: Inputs for Name, Phone. "Save" calls `PUT /auth/me`.
- **Password Section**: "Change Password" toggles fields:
    - New Password
    - Confirm Password
    - "Update Password" button.
    - Validates match before calling `PUT /auth/me`.

#### [MODIFY] [StaffTable.jsx](file:///d:/PROJECTS/Subscription-Manager/frontend/src/components/StaffTable.jsx)
- Add "View" (Eye icon) button for Admins (in addition to Edit/Delete).
- Opens `StaffDialog` in read-only mode? Or a new `StaffDetailsDialog`?
    - Simplest: Reuse `StaffDialog` with `readOnly` prop.

#### [MODIFY] [StaffDialog.jsx](file:///d:/PROJECTS/Subscription-Manager/frontend/src/components/StaffDialog.jsx)
- Support `readOnly` prop to disable inputs and hide "Save" button.

#### [MODIFY] [Layout.jsx](file:///d:/PROJECTS/Subscription-Manager/frontend/src/components/Layout.jsx)
- Add "Profile" link in the User Dropdown/Header or Sidebar.

## Verification Plan
### Manual Verification
1.  **Backend**: Test `PUT /auth/me` via Swagger or Frontend.
2.  **Profile**:
    -   Login. Navigate to Profile.
    -   Edit Name -> Save -> Verify update.
    -   Change Password -> Logout -> Login with new password.
3.  **Staff View**:
    -   Login as Admin.
    -   Click "Eye" icon on a staff member.
    -   Verify details are visible but not editable (if read-only intent) or just standard Edit.
