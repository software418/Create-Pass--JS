# 02 Codebase Implementation Guide

This document details the specific files to change, create, and what to add in each to implement the Dynamic Roles and Data Scope architecture.

## 1. Backend Modifications

### `backend/prisma/schema.prisma`
- **What to add:** 
  - Add `dataScope String @default("personal")` to the `Role` model.
  - Optionally add a `Session` model to track active sessions for the user profile panel (or plan to mock it initially).
  - Add `featureTokens Json?` or continue using `Permission` module with expanded token nomenclature (e.g., `master:access`, `master:create`).

### `backend/src/middlewares/auth.middleware.js` (or `permission.middleware.js`)
- **What to add:**
  - Create a new middleware function `requireToken(tokenName)` that checks if the user's role permissions include the specified action token. Returns `403 Forbidden` if not.
  - Create a `applyDataScope` utility that appends prisma `where` clauses based on the user's `dataScope` (`global`, `departmental`, `personal`).

### `backend/src/controllers/auth.controller.js`
- **What to add:**
  - Ensure the user's `dataScope` and `permissions` are serialized correctly in the profile response and JWT token (if applicable).
  - Implement an endpoint to fetch active sessions (if tracking).
  - Implement an endpoint to `logout_all_devices`.

### `backend/src/controllers/*.js` (Data Controllers e.g., Pass Controller, Report Controller)
- **What to add:**
  - Inject the `applyDataScope` utility into the fetch queries to automatically filter rows based on the user's horizon.
  - Apply `requireToken(...)` middleware to all routes (e.g., `router.delete('/:id', requireToken('master:delete'), ...)`).

## 2. Frontend Modifications

### `pass-Frontend/src/shared/layouts/DashboardLayout.jsx`
- **What to add:**
  - Modify the `hasAccess` function to check for Feature Tokens (e.g., `pass:access`, `master:access`) rather than legacy module names.
  - Add an `onClick` handler to the `<Avatar fallback="US" />` component to toggle the visibility of the new `UserProfilePanel`.

### `pass-Frontend/src/shared/components/UserProfilePanel.jsx` (NEW FILE)
- **What to create:**
  - A slide-out panel or modal that displays the read-only user profile.
  - Needs sections for: User Details, System Password (masked with toggleable eye icon), My Allowed Permissions (rendered dynamically from user context), and My Current Active Sessions.
  - Needs a "Logout All Devices" button.

### `pass-Frontend/src/features/auth/AuthContext.jsx`
- **What to add:**
  - Expose the user's full permission list, `dataScope`, and session data.
  - Provide a helper `hasActionToken(token)` to be used by UI components to conditionally render action buttons (like the trash icon).

### `pass-Frontend/src/pages/Dashboard/index.jsx` & Data Tables
- **What to add:**
  - Wrap edit/delete buttons with a check: `{hasActionToken('master:delete') && <DeleteIcon />}`.
