# 01 Dynamic Roles, Feature Tokens & Data Scope Architecture

## 1. Feature Access Tokens & Granular CRUD
The system shifts from static module permissions to granular "Feature Tokens" and "Action Tokens".
- **Feature Tokens:** Control visibility of major UI sections in the sidebar (e.g., `pass:access`, `master:access`, `reports:access`, `print:access`).
- **Action Tokens:** Control specific CRUD operations within those features (e.g., `master:create`, `master:read`, `master:update`, `master:delete`).
- **Enforcement:**
  - **Frontend:** UI components conditionally render based on these tokens. E.g., if `master:delete` is missing, the trash icon in the Data Table is hidden. Sidebar items require specific feature tokens.
  - **Backend:** API endpoints implement a permission middleware that checks for the exact token required (e.g., `requireToken('master:delete')`). Unauthorised requests receive a `403 Forbidden`.

## 2. Dynamic Data-Scope Visibility (The Scope Archetype)
To handle dynamic roles (since role names are not hardcoded), a `dataScope` attribute is added to the `Role` model. This defines the Data Visibility Horizon for any user assigned to that role.
- **Global Scope:** Can see all records across the system (Super Admin, System Admin, Security Guards checking logs).
- **Departmental Scope:** Can see records where the host employee belongs to the user's `department_id` (Managers).
- **Personal Scope:** Can see records where their own account ID matches the `host_user_id` (Standard Employees).

## 3. User Profile Panel
A dedicated profile summary display that is accessed by clicking the user initials widget in the top right.
- Displays structured, read-only data.
- Employee ID, Full Name, Department, Designation.
- System Password masked with an eye icon to reveal plain text (no edits allowed).
- "My Allowed Permissions" listing.
- "My Current Active Sessions" with a "Logout All Devices" option.
