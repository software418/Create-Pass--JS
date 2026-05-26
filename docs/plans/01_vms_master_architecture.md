# VMS Master Architecture & Operational Workflow

This document serves as the single source of truth for the Visitor Management System (VMS) architecture, data models, role-based access control (RBAC), and operational workflows, incorporating all approved structural mechanics.

---

## 1. System Foundation & Security

### 1.1 Authentication (JWT Double-Token System)
To ensure maximum security and a seamless user experience, the system utilizes a Double-Token JWT strategy:
- **Access Token (Short-Lived):** Used for authorizing API requests. Expires quickly (e.g., 15 minutes) to minimize risk if intercepted.
- **Refresh Token (Long-Lived, HttpOnly):** Stored securely in an HttpOnly cookie to prevent XSS attacks. Used silently by the frontend to obtain a new Access Token without forcing the user to log in repeatedly.

### 1.2 Company Registration
- **Super Admin Exclusive:** The ability to register or manage a Company within the system is strictly hardcoded to the Super Admin. This functionality cannot be assigned to any other role under any circumstances.

---

## 2. The Core Relational Blueprint

The data architecture is highly optimized, using flat fields where appropriate to avoid unnecessary table joins.

### Entity Structure
- **Users:** The central entity for all individuals logging into the system.
  - `role_id`: Connects the user to a specific Role (determines UI layout and permissions).
  - `department_id`: Connects the user to a Department (used for approval routing).
  - `designation`: A **pure string field** typed during creation (e.g., "Senior Engineer"). No separate designation table is used.
  - `assigned_location_id`: A field **strictly reserved for Guards**, locking them to a specific physical checkpost (e.g., "Main Gate", "Basement Parking"). It is not applicable to standard employees or managers.

- **Departments:**
  - `name`: E.g., "Engineering", "HR".
  - `manager_user_id`: A pointer to the User who is currently the head of the department (the designated approver).

- **Roles & Approval Weights:**
  - Roles define exactly what a user can see and do.
  - **Weight System:** Every role is assigned a numerical "Weight" (e.g., 10, 40, 80). 
  - The **Super Admin** role has a hardcoded default weight of **100**.
  - Weights are assigned to the **Role**, not the department or the individual user. This determines the hierarchy of who can approve passes (a user can only approve a pass if their role weight allows it).

---

## 3. Granular Role-Based Access Control (RBAC)

Permissions are not assigned broadly. They are highly specific, separating View (Access) rights from Action rights, and scoped down to specific sub-modules.

### 3.1 Master Settings Permissions
Instead of a single generic "CRUD for Master Settings" toggle, the Admin must select the exact sub-setting they want to grant access to:
1. Select the specific Master Setting (e.g., `Purpose`, `Employee`, `Department`).
2. Assign exact CRUD operations (Create, Read, Update, Delete) to that specific setting.
*Example:* A Manager might have `read` and `create` access for `Employee` configurations, but absolutely zero access to `Department` configurations.

### 3.2 Dashboard Actions & Field Visibility
The Dashboard is highly dynamic. When configuring a role's Dashboard access, the Admin specifies:
- **Allowed Actions:** Specific functional actions like `Check In`, `Check Out`, `View Details`, `Print Pass`. It is not standard CRUD.
- **Field Visibility:** The Admin configures exactly which data columns and fields are visible to that specific role on their dashboard view.

### 3.3 Dashboard Data Scoping (Who Sees What)
Data visibility on the Dashboard automatically scales based on the user's role and position:
- **Super Admin, Admin, and Guard:** Can list and view **ALL** visitor pass data across the entire facility.
- **Department Manager:** Can only see pass data related to their specific department (i.e., any pass where the host employee belongs to their `department_id`).
- **Standard Employee:** Can only see pass data directly related to themselves (i.e., they are the designated host).

---

## 4. Operational Setup Workflow (Zero-to-One Launch)

1. **Create Custom Roles:** Super Admin creates roles, assigns a Weight (Super Admin is 100), configures granular module permissions (Master Settings), Dashboard actions, and field visibility.
2. **Create Manager Accounts:** Provision user accounts for department heads. Enter their Designation as a string. Leave Department blank initially.
3. **Create Departments:** Create structural departments and assign the managers from Step 2 as the `manager_user_id`.
4. **Onboard Staff & Guards:** Create remaining users. Link them to their Departments. For Guards, assign them a specific `assigned_location_id` (Main Gate).

---

## 5. Runtime Execution & Notification Flow

### Real-Time In-App Notifications
The system completely bypasses external email for real-time operations, relying entirely on WebSockets and an `in_app_notifications` table for instant communication.

### The Smart Approval Routing
1. A guest arrives for Sarah (Engineering).
2. The Guard uses the **Cascading Selection System**:
   - Guard selects "Engineering" -> Frontend filters list -> Guard selects "Sarah".
3. System reads Sarah's profile: `department_id = Engineering`.
4. System checks Engineering department: `manager_user_id = Vikram`.
5. System inserts a pending pass and creates a notification record for Vikram.
6. A WebSocket event fires instantly to Vikram's dashboard, illuminating his notification bell. 
7. The Guard's dashboard shows the pass as `PENDING` until Vikram clicks "Approve".

*(Note: If Neha replaces Vikram, the Super Admin simply updates the `manager_user_id` on the Engineering department record. All new routing instantly switches to Neha without altering any employee profiles.)*
