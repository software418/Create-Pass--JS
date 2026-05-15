import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../shared/layouts/DashboardLayout";
import { AuthLayout } from "../shared/layouts/AuthLayout";
import CreatePassPage from "../pages/CreatePassPage";
import { EmployeePage } from "@/pages/EmployeePage";
import { CarryWithPage } from "@/pages/CarryWithPage";
import { PurposePage } from "@/pages/PurposePage";
import { VisitorAreaPage } from "@/pages/VisitingAreaPage";
import { VisitorTypePage } from "@/pages/VisitorTypePage";
export const AppRoutes = () => {
  return _jsxs(Routes, {
    children: [
      _jsx(Route, { element: _jsx(AuthLayout, {}) }),
      _jsxs(Route, {
        element: _jsx(DashboardLayout, {}),
        children: [
          _jsx(Route, {
            path: "/",
            element: _jsx("div", {
              className: "text-2xl font-bold",
              children: "Welcome to Dashboard",
            }),
          }),
          _jsx(Route, {
            path: "/create-pass",
            element: _jsx(CreatePassPage, {}),
          }),
          _jsx(Route, {
            path: "/employee-config",
            element: _jsx(EmployeePage, {}),
          }),
          _jsx(Route, {
            path: "/visiting-area-config",
            element: _jsx(VisitorAreaPage, {}),
          }),
          _jsx(Route, {
            path: "/visitor-type-config",
            element: _jsx(VisitorTypePage, {}),
          }),
          _jsx(Route, {
            path: "/purpose-config",
            element: _jsx(PurposePage, {}),
          }),
          _jsx(Route, {
            path: "/carry-with-config",
            element: _jsx(CarryWithPage, {}),
          }),
        ],
      }),
    ],
  });
};
