# Enterprise VMS Technical Implementation Plan

This document outlines the technical file-level changes, new modules, and the JWT security strategy required to implement the Enterprise VMS architecture.

## 1. Two-Token JWT Security Strategy
To enhance security, the authentication system will use a **Refresh/Access Token Architecture**:

*   **Short-Lived Access Token (15 Minutes):**
    *   Issued upon login, sent in the JSON response, and stored in memory.
    *   Attached to the `Authorization: Bearer` header for every API request.
*   **Long-Lived Refresh Token (7 Days):**
    *   Sent as an `HttpOnly`, `Secure` cookie from the backend to prevent XSS attacks.
*   **Background Refresh (Frontend):**
    *   An Axios Interceptor will catch `401 Unauthorized` errors. 
    *   It will transparently call a `/refresh-token` endpoint using the HttpOnly cookie, retrieve a new Access Token, and retry the failed request without interrupting the user.

## 2. Database Schema Updates (`prisma/schema.prisma`)
*   **`Role` & `Permission`:** New models to store dynamic roles and their CRUD mappings via `RolePermission`.
*   **`Notification`:** New model to store real-time alerts linked to a `userId`.
*   **`User` & `Employee`:** 
    *   Replace hardcoded `role` with `roleId`.
    *   Add `employeeId` to `User`.
    *   Add `assignedLocationId` to `User` for guards.
    *   Add `managerId` to `Employee` for the approval hierarchy.
*   **`FormData` (Gate Passes):** Add `createdByUserId` and `managerApprovalStatus`.

## 3. Backend Modifications (`backend/`)
### Modified Files:
*   `src/features/auth/auth.service.js` & `controller.js`: Implement 2-token generation and `/refresh-token` endpoint.
*   `src/features/gate_pass/`: Update pass creation and check-in to use the Manager Approval flow and Notifications.
*   `src/features/users/`: Allow Admins to assign roles and locations during user creation.
*   `src/middleware/auth.middleware.js`: Verify short-lived access tokens.

### New Modules & Files:
*   `src/features/roles/`: New feature module for Super Admins to manage User Types and map permissions.
*   `src/features/notifications/`: New feature module for fetching and reading in-app alerts.
*   `src/middleware/rbac.middleware.js`: Dynamic permission checker (e.g., `requirePermission('CREATE_PASS')`).

## 4. Frontend Modifications (`pass-Frontend/`)
### Modified Files:
*   `src/shared/services/queryClient.js`: Add the global Axios Interceptor for background token refresh.
*   `src/app/store.js` (or Auth Context): Store short-lived access token and dynamic Permissions array.
*   `src/shared/components/Sidebar.jsx`: Render links dynamically based on user permissions.
*   `src/pages/Dashboard/Dashboard.jsx`: Render completely different views/widgets based dynamically on permissions.

### New Folders & Files:
*   `src/pages/Roles/RoleManagementPage.jsx`: The Super Admin control panel to create User Types and assign feature checkboxes.
*   `src/shared/components/NotificationBell/NotificationBell.jsx`: Navbar dropdown displaying real-time alerts.
*   `src/pages/Approvals/ManagerApprovalsPage.jsx`: Dedicated dashboard for Managers to approve passes.
