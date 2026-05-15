import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link } from "react-router-dom";
import { Navbar } from "../ui/organisms/Navbar";
import { Sidebar, SidebarItem } from "../ui/organisms/Sidebar";
import {
  Package,
  LogOut,
  UserRoundCog,
  Factory,
  FilePlus,
  Users,
  DoorOpen,
} from "lucide-react";
import { Button } from "../ui/atoms/Button";
import { Avatar } from "../ui/atoms/Avatar";
export const DashboardLayout = () => {
  return _jsxs("div", {
    className: "flex h-screen w-screen flex-col bg-surface overflow-hidden",
    children: [
      _jsx(Navbar, {
        children: _jsxs("div", {
          className: "flex flex-1 items-center justify-between",
          children: [
            _jsx("div", {
              className: "font-bold text-xl tracking-tight text-primary",
              children: "VMS",
            }),
            _jsxs("div", {
              className: "flex items-center gap-4",
              children: [
                _jsx(Button, {
                  variant: "ghost",
                  size: "icon",
                  children: _jsx(LogOut, { className: "h-4 w-4" }),
                }),
                _jsx(Avatar, { fallback: "US" }),
              ],
            }),
          ],
        }),
      }),
      _jsxs("div", {
        className: "flex flex-1 h-[calc(100vh-64px)] overflow-hidden",
        children: [
          _jsxs(Sidebar, {
            children: [
              _jsx(Link, {
                to: "/create-pass",
                children: _jsx(SidebarItem, {
                  icon: FilePlus,
                  label: "Create Pass",
                }),
              }),
              _jsx(Link, {
                to: "/employee-config",
                children: _jsx(SidebarItem, {
                  icon: UserRoundCog,
                  label: "Employee",
                }),
              }),
              _jsx(Link, {
                to: "/visiting-area-config",
                children: _jsx(SidebarItem, {
                  icon: Factory,
                  label: "Visiting Area",
                }),
              }),
              _jsx(Link, {
                to: "/visitor-type-config",
                children: _jsx(SidebarItem, {
                  icon: Users,
                  label: "Visitor type",
                }),
              }),
              _jsx(Link, {
                to: "/purpose-config",
                children: _jsx(SidebarItem, {
                  icon: DoorOpen,
                  label: "Purpose",
                }),
              }),
              _jsx(Link, {
                to: "/carry-with-config",
                children: _jsx(SidebarItem, {
                  icon: Package,
                  label: "Carry With",
                }),
              }),
            ],
          }),
          _jsx("main", {
            className: "flex-1 overflow-y-auto p-6 md:p-8",
            children: _jsx(Outlet, {}),
          }),
        ],
      }),
    ],
  });
};
