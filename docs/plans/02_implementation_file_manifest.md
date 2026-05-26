# Implementation File Manifest

Based on the `01_vms_master_architecture.md` blueprint, this document outlines the exact files across the backend and frontend that need to be created or modified to fully execute the new system architecture. 

This serves as our active work list to save time and resources during development.

---

## 1. Backend Changes (Node.js / Express)

### 1.1 Authentication & Security (Double-Token JWT)
- **`backend/src/features/auth/auth.controller.js` & `auth.service.js`**
  - **Action:** Refactor login logic to generate both a short-lived Access Token and a long-lived Refresh Token. Set the Refresh Token as an HttpOnly cookie.
- **`backend/src/utils/jwt.utils.js`**
  - **Action:** Add utility functions for generating and verifying both access and refresh tokens.
- **`backend/src/features/auth/auth.routes.js`**
  - **Action:** Add a `/refresh` endpoint to handle silently issuing new Access Tokens.
- **`backend/src/middleware/auth.middleware.js`**
  - **Action:** Refactor to validate Access Tokens and enforce the new granular RBAC permission matrix on API endpoints.

### 1.2 Roles & Permissions Matrix
- **`backend/src/features/roles/role.schema.js`** *(New File)*
  - **Action:** Create schema for Roles (e.g., name, weight).
- **`backend/src/features/roles/permission.schema.js`** *(New File)*
  - **Action:** Create the junction schema linking Roles to specific modules (e.g., Master Setting: Employee) with strict CRUD booleans and Dashboard Action toggles.
- **`backend/src/features/roles/role.controller.js` & `role.routes.js`** *(New Files)*
  - **Action:** Create endpoints for the Super Admin to manage roles, weights, and their granular permissions.

### 1.3 Core Entities (Users & Departments)
- **`backend/src/features/employee/employee.schema.js`** (or equivalent User schema)
  - **Action:** Modify schema. Remove foreign keys for designation. Add `designation` (String), `role_id` (Ref), `department_id` (Ref), and `assigned_location_id` (Ref - for Guards only).
- **`backend/src/features/employee/employee.controller.js` & `employee.service.js`**
  - **Action:** Update user creation/update logic to handle the new flat schema and strictly enforce that only Super Admins can assign Super Admin roles.
- **`backend/src/features/department/department.schema.js`** (or equivalent)
  - **Action:** Add `manager_user_id` pointer field to designate the department head.

### 1.4 Real-Time Approval & Notifications
- **`backend/src/features/gate_pass/gp.service.js` & `gp.controller.js`**
  - **Action:** Rewrite the approval routing logic. Remove email dispatches. Look up the host's `department_id`, find the `manager_user_id`, and insert an internal notification record.
- **`backend/src/features/notifications/notification.schema.js` & `controller.js`** *(New Files)*
  - **Action:** Create the `in_app_notifications` table/schema.
- **`backend/src/server.js`** (or new `socket.js`)
  - **Action:** Integrate Socket.io (or similar WebSocket) to emit real-time events to the frontend when a notification is created.

---

## 2. Frontend Changes (React / Vite)

### 2.1 Authentication Integration
- **`pass-Frontend/src/shared/services/api.js`** (Axios/Fetch Interceptors)
  - **Action:** Implement interceptors to automatically catch `401 Unauthorized` errors, call the backend `/refresh` endpoint silently, and retry the failed request.

### 2.2 Super Admin Configuration Panels
- **`pass-Frontend/src/pages/Roles/RoleManagement.jsx`** *(New File)*
  - **Action:** Build the UI matrix for Super Admins to create Roles. Must include the Weight input (1-100) and the granular checkbox grid for Master Settings (Module -> Read, Create, Update, Delete) and Dashboard Actions (Check-in, Check-out, etc.).
- **`pass-Frontend/src/pages/CompanyRegisterPage.jsx`**
  - **Action:** Wrap the entire page in a strict permission check ensuring absolutely only the Super Admin can view or interact with it.

### 2.3 User & Department Forms
- **`pass-Frontend/src/pages/EmployeePage.jsx`** (or User creation modal)
  - **Action:** Update the form. Change designation to a standard text input. Add Role dropdown. Add Department dropdown. Add `assigned_location_id` dropdown (conditionally visible only if the selected role is "Guard").
- **`pass-Frontend/src/pages/DepartmentPage.jsx`**
  - **Action:** Update the form to include a "Department Manager" dropdown to set the `manager_user_id`.

### 2.4 Smart Gate Pass Creation
- **`pass-Frontend/src/pages/CreatePass/components/VisitDetailsSection.jsx`** (or relevant "Meet With" component)
  - **Action:** Implement the "Live Search Combobox" or Cascading Dropdown (Department -> Employee). Ensure it fetches fast, lightweight strings from the database to handle thousands of records seamlessly.

### 2.5 Dynamic Dashboard
- **`pass-Frontend/src/pages/Dashboard/index.jsx` & `components/DashboardTable.jsx`**
  - **Action (Data Scoping):** Ensure API calls dynamically return data based on the user's role (Super Admin sees all, Manager sees department passes, Employee sees their own passes).
  - **Action (Column Visibility):** Read the user's role configuration from the JWT/state and dynamically hide/show table columns.
  - **Action (Action Guarding):** Conditionally render the "Check In", "Check Out", and "Approve" buttons based on the user's explicit Dashboard Action permissions and their Role Weight.

### 2.6 Real-Time UI (WebSockets)
- **`pass-Frontend/src/shared/layouts/DashboardLayout.jsx`** (or Navbar)
  - **Action:** Initialize WebSocket connection. Add a notification bell component that increments instantly when an approval request arrives for the logged-in Manager.
