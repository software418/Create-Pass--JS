# Frontend Routing & Authorization Plan

This document outlines the routing architecture for the React frontend, based on the `react-router-dom` v6+ pattern. It implements secure navigation, role/permission-based access control, and smart redirections tailored to the VMS architecture.

---

## 1. Core Concepts

Instead of merely checking roles (except for Super Admin exclusive pages), the routing system will primarily check the **Permissions Matrix** assigned to the user's role. 

The frontend will rely on a global state manager (e.g., Zustand's `useAuthStore`) that holds:
- `isLoggedIn`: Boolean indicating authentication state.
- `user`: The user object containing their `role` (e.g., "Super Admin", "Guard", "Employee") and a `permissions` array (e.g., `['pass:read', 'pass:create', 'master:read']`).

---

## 2. Route Guard Components

### `GuestRoute`
Ensures that authenticated users cannot access public pages like Login. If an authenticated user tries to access `/login`, they are redirected to their designated landing page.

### `ProtectedRoute`
The baseline guard. Ensures the user is logged in. If not, redirects to `/login`.

### `PermissionRoute`
A specialized guard that checks if the logged-in user has the specific permission string required to view a module. If the user lacks the permission, they are redirected to an `Unauthorized` page or the Dashboard.

### `SuperAdminRoute`
A strict guard exclusively for the Super Admin, checking the `user.role` directly for high-security configurations like Company Registration.

---

## 3. Example Implementation Architecture

```jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/shared/store/authStore';
import { ROUTES } from '@/shared/const/routes';
import { PERMISSIONS, ROLES } from '@/shared/const/auth';

// 1. Guest Guard (Redirects to Dashboard if already logged in)
export const GuestRoute = () => {
  const { isLoggedIn } = useAuthStore();
  if (isLoggedIn) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <Outlet />;
};

// 2. Base Protected Guard (Must be logged in)
export const ProtectedRoute = () => {
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <Outlet />;
};

// 3. Granular Permission Guard (Checks Matrix)
export const PermissionRoute = ({ requiredPermission }) => {
  const { user } = useAuthStore();
  
  // Super Admin bypasses all permission checks
  if (user?.role === ROLES.SUPER_ADMIN) return <Outlet />;
  
  // Check if user's permission array includes the required action
  if (!user?.permissions?.includes(requiredPermission)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }
  
  return <Outlet />;
};

// 4. Strict Role Guard (e.g., Company Settings)
export const SuperAdminRoute = () => {
  const { user } = useAuthStore();
  if (user?.role !== ROLES.SUPER_ADMIN) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }
  return <Outlet />;
};
```

---

## 4. Complete Router Definition

The application will use `createBrowserRouter` to cleanly map the URL tree to the layout and guards.

```jsx
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/shared/const/routes';
import { PERMISSIONS } from '@/shared/const/auth';

// Layouts
import AuthLayout from '@/shared/layouts/AuthLayout';
import DashboardLayout from '@/shared/layouts/DashboardLayout';

// Pages
import LoginPage from '@/pages/Auth/Login';
import DashboardPage from '@/pages/Dashboard';
import CreatePassPage from '@/pages/CreatePass';
import PassActionPage from '@/pages/PassAction';
import CompanyRegisterPage from '@/pages/CompanyRegisterPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

export const router = createBrowserRouter([
  // GUEST ROUTES (Login, Forgot Password)
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          // { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },
  
  // AUTHENTICATED ROUTES
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Base Dashboard (Accessible by all logged-in users, data scoped inside component)
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.UNAUTHORIZED, element: <UnauthorizedPage /> },

          // SUPER ADMIN EXCLUSIVE
          {
            element: <SuperAdminRoute />,
            children: [
              { path: ROUTES.COMPANY_REGISTER, element: <CompanyRegisterPage /> },
              { path: ROUTES.ROLE_MANAGEMENT, element: <RoleManagementPage /> },
            ]
          },

          // GATE PASS MODULE
          {
            element: <PermissionRoute requiredPermission={PERMISSIONS.PASS_READ} />,
            children: [
              { path: ROUTES.CREATE_PASS, element: <CreatePassPage /> },
              { path: ROUTES.PASS_ACTION, element: <PassActionPage /> },
            ]
          },

          // MASTER SETTINGS MODULE
          {
            element: <PermissionRoute requiredPermission={PERMISSIONS.MASTER_READ} />,
            children: [
              { path: ROUTES.EMPLOYEE_CONFIG, element: <EmployeePage /> },
              { path: ROUTES.DEPARTMENT_CONFIG, element: <DepartmentPage /> },
              { path: ROUTES.LOCATION_CONFIG, element: <LocationPage /> },
              // ... other master configs
            ]
          },

          // REPORTS MODULE
          {
            element: <PermissionRoute requiredPermission={PERMISSIONS.REPORTS_READ} />,
            children: [
              { path: ROUTES.REPORT_GENERATE, element: <ReportPage mode="generate" /> },
              { path: ROUTES.REPORT_TODAY, element: <ReportPage mode="today" /> },
            ]
          },

          // PRINT MODULE
          {
            element: <PermissionRoute requiredPermission={PERMISSIONS.PRINT_READ} />,
            children: [
              { path: ROUTES.PRINT_SETTINGS, element: <PrintSettingsPage /> },
            ]
          }
        ],
      },
    ],
  },

  // CATCH ALL
  {
    path: "*",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  }
]);
```

---

## 5. Implementation Steps

1. **Setup Constants:** Define all route strings in `@/shared/const/routes.js` and permission keys in `@/shared/const/auth.js`.
2. **Setup Global Store:** Update `authStore` to hold the user's fetched permission array after a successful login.
3. **Build Guards:** Create `ProtectedRoute.jsx`, `GuestRoute.jsx`, `PermissionRoute.jsx`, and `SuperAdminRoute.jsx` in `@/app/guards/` or `@/shared/components/`.
4. **Refactor App Entry:** Replace the existing `<Routes>` array in `routes.jsx` with the new `RouterProvider` passing the `createBrowserRouter` instance.
