import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { AuthLayout } from "@/shared/layouts/AuthLayout";
import CreatePassPage from "@/pages/CreatePass";
import { EmployeePage } from "@/pages/EmployeePage";
import { RoleManagement } from "@/pages/Roles/RoleManagement";
import { CarryWithPage } from "@/pages/CarryWithPage";
import { PurposePage } from "@/pages/PurposePage";
import { VisitorAreaPage } from "@/pages/VisitingAreaPage";
import { VisitorTypePage } from "@/pages/VisitorTypePage";
import { DepartmentPage } from "@/pages/DepartmentPage";
import { CompanyRegisterPage } from "@/pages/CompanyRegisterPage";
import { LocationPage } from "@/pages/LocationPage";
import { IdTypePage } from "@/pages/IdTypePage";
import DashbordPage from "@/pages/Dashboard";
import ReportPage from "@/pages/Report";
import PassActionPage from "@/pages/PassAction";
import PrintPassByIdPage from "@/pages/Report/PrintPassByIdPage";
import PrintSettingsPage from "@/pages/Report/PrintSettingsPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { ProtectedRoute, GuestRoute, PermissionRoute, SuperAdminRoute } from "@/shared/components/guards";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <GuestRoute />,
    children: [
      {
        path: "",
        element: <LoginPage />
      }
    ]
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <div className="text-2xl font-bold">Welcome to Dashboard</div>
          },
          {
            path: "dashboard",
            element: <DashbordPage />
          },
          {
            path: "create-pass",
            element: <CreatePassPage />
          },
          {
            path: "pass/:id/action",
            element: <PassActionPage />
          },
          {
            path: "report/generate",
            element: <ReportPage mode="generate" />
          },
          {
            path: "report/today",
            element: <ReportPage mode="today" />
          },
          {
            path: "report/print-pass",
            element: <PrintPassByIdPage />
          },
          {
            path: "report/print-settings",
            element: <PrintSettingsPage />
          },
          // Master Settings & Role Permission Routes (Guarded by specific module permissions)
          {
            element: <PermissionRoute module="Role" />,
            children: [{ path: "role-config", element: <RoleManagement /> }]
          },
          {
            element: <PermissionRoute module="Employee" />,
            children: [{ path: "employee-config", element: <EmployeePage /> }]
          },
          {
            element: <PermissionRoute module="Department" />,
            children: [{ path: "department-config", element: <DepartmentPage /> }]
          },
          {
            element: <PermissionRoute module="VisitingArea" />,
            children: [{ path: "visiting-area-config", element: <VisitorAreaPage /> }]
          },
          {
            element: <PermissionRoute module="VisitorType" />,
            children: [{ path: "visitor-type-config", element: <VisitorTypePage /> }]
          },
          {
            element: <PermissionRoute module="Purpose" />,
            children: [{ path: "purpose-config", element: <PurposePage /> }]
          },
          {
            element: <PermissionRoute module="CarryWith" />,
            children: [{ path: "carry-with-config", element: <CarryWithPage /> }]
          },
          {
            element: <PermissionRoute module="CompanyRegister" />,
            children: [{ path: "company-register-config", element: <CompanyRegisterPage /> }]
          },
          {
            element: <PermissionRoute module="Location" />,
            children: [{ path: "location-config", element: <LocationPage /> }]
          },
          {
            element: <PermissionRoute module="IdType" />,
            children: [{ path: "id-type-config", element: <IdTypePage /> }]
          }
        ]
      }
    ]
  }
]);
