import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { AuthLayout } from "@/shared/layouts/AuthLayout";
import CreatePassPage from "@/pages/CreatePass";
import { EmployeePage } from "@/pages/EmployeePage";
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
export const AppRoutes = () => {
  return (
    <Routes>
      {<Route element={<AuthLayout />} />}
      {
        <Route element={<DashboardLayout />}>
          {
            <Route
              path="/"
              element={
                <div className="text-2xl font-bold">Welcome to Dashboard</div>
              }
            />
          }
          {<Route path="/dashboard" element={<DashbordPage />} />}
          {<Route path="/create-pass" element={<CreatePassPage />} />}
          {<Route path="/pass/:id/action" element={<PassActionPage />} />}
          {<Route path="/employee-config" element={<EmployeePage />} />}
          {<Route path="/visiting-area-config" element={<VisitorAreaPage />} />}
          {<Route path="/visitor-type-config" element={<VisitorTypePage />} />}
          {<Route path="/purpose-config" element={<PurposePage />} />}
          {<Route path="/carry-with-config" element={<CarryWithPage />} />}
          {<Route path="/department-config" element={<DepartmentPage />} />}
          {<Route path="/company-register-config" element={<CompanyRegisterPage />} />}
          {<Route path="/location-config" element={<LocationPage />} />}
          {<Route path="/id-type-config" element={<IdTypePage />} />}
          {<Route path="/report/generate" element={<ReportPage mode="generate" />} />}
          {<Route path="/report/today" element={<ReportPage mode="today" />} />}
          {<Route path="/report/print-pass" element={<PrintPassByIdPage />} />}
          {<Route path="/report/print-settings" element={<PrintSettingsPage />} />}
        </Route>
      }
    </Routes>
  );
};
