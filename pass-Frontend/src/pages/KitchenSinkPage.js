import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "../shared/ui/atoms/Button";
import { Input } from "../shared/ui/atoms/Input";
import { Label } from "../shared/ui/atoms/Label";
import { Checkbox } from "../shared/ui/atoms/Checkbox";
import { Spinner } from "../shared/ui/atoms/Spinner";
import { Typography } from "../shared/ui/atoms/Typography";
import { Avatar } from "../shared/ui/atoms/Avatar";
import { Badge } from "../shared/ui/atoms/Badge";
import { FormField } from "../shared/ui/molecules/FormField";
import { PasswordField } from "../shared/ui/molecules/PasswordField";
import { SearchInput } from "../shared/ui/molecules/SearchInput";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../shared/ui/molecules/Card";
import { Alert } from "../shared/ui/molecules/Alert";
import { Modal } from "../shared/ui/organisms/Modal";
const KitchenSinkPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return _jsxs("div", {
    className: "space-y-12 pb-24",
    children: [
      _jsxs("div", {
        children: [
          _jsx(Typography, {
            variant: "h1",
            children: "Kitchen Sink (UI Components)",
          }),
          _jsx(Typography, {
            variant: "muted",
            className: "mt-2",
            children:
              "A comprehensive preview of all universal UI components built from scratch.",
          }),
        ],
      }),
      _jsxs("section", {
        className: "space-y-6 border-b pb-8",
        children: [
          _jsx(Typography, { variant: "h2", children: "Atoms" }),
          _jsxs("div", {
            className: "space-y-4",
            children: [
              _jsx(Typography, { variant: "h4", children: "Buttons" }),
              _jsxs("div", {
                className: "flex flex-wrap gap-4 items-center",
                children: [
                  _jsx(Button, { variant: "primary", children: "Primary" }),
                  _jsx(Button, { variant: "secondary", children: "Secondary" }),
                  _jsx(Button, { variant: "outline", children: "Outline" }),
                  _jsx(Button, { variant: "danger", children: "Danger" }),
                  _jsx(Button, { variant: "ghost", children: "Ghost" }),
                  _jsx(Button, {
                    variant: "primary",
                    isLoading: true,
                    children: "Loading",
                  }),
                ],
              }),
            ],
          }),
          _jsxs("div", {
            className: "space-y-4 pt-4",
            children: [
              _jsx(Typography, { variant: "h4", children: "Badges & Avatars" }),
              _jsxs("div", {
                className: "flex flex-wrap gap-4 items-center",
                children: [
                  _jsx(Badge, { variant: "default", children: "Default" }),
                  _jsx(Badge, { variant: "secondary", children: "Secondary" }),
                  _jsx(Badge, {
                    variant: "destructive",
                    children: "Destructive",
                  }),
                  _jsx(Badge, { variant: "outline", children: "Outline" }),
                  _jsxs("div", {
                    className: "ml-8 flex items-center gap-4",
                    children: [
                      _jsx(Avatar, { fallback: "JD", size: "sm" }),
                      _jsx(Avatar, { fallback: "JD", size: "md" }),
                      _jsx(Avatar, { fallback: "JD", size: "lg" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          _jsxs("div", {
            className: "space-y-4 pt-4",
            children: [
              _jsx(Typography, { variant: "h4", children: "Loaders" }),
              _jsxs("div", {
                className: "flex gap-4 items-center",
                children: [
                  _jsx(Spinner, { size: "sm" }),
                  _jsx(Spinner, { size: "md" }),
                  _jsx(Spinner, { size: "lg" }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsxs("section", {
        className: "space-y-6 border-b pb-8",
        children: [
          _jsx(Typography, { variant: "h2", children: "Molecules" }),
          _jsxs("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-8",
            children: [
              _jsxs("div", {
                className: "space-y-4",
                children: [
                  _jsx(Typography, {
                    variant: "h4",
                    children: "Form Elements",
                  }),
                  _jsx(FormField, {
                    label: "Email Address",
                    children: _jsx(Input, {
                      type: "email",
                      placeholder: "john@example.com",
                    }),
                  }),
                  _jsx(FormField, {
                    label: "Password",
                    error: "Password must be at least 8 characters",
                    children: _jsx(PasswordField, {
                      placeholder: "Enter password",
                      error: true,
                    }),
                  }),
                  _jsxs("div", {
                    className: "flex items-center space-x-2 pt-2",
                    children: [
                      _jsx(Checkbox, { id: "terms" }),
                      _jsx(Label, {
                        htmlFor: "terms",
                        children: "Accept terms and conditions",
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "pt-4",
                    children: [
                      _jsx(Label, {
                        className: "mb-2 block",
                        children: "Search Input",
                      }),
                      _jsx(SearchInput, {}),
                    ],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "space-y-4",
                children: [
                  _jsx(Typography, { variant: "h4", children: "Alerts" }),
                  _jsx(Alert, {
                    variant: "default",
                    title: "Info Alert",
                    children: "This is a default informational alert.",
                  }),
                  _jsx(Alert, {
                    variant: "success",
                    title: "Success",
                    children: "Your action was completed successfully.",
                  }),
                  _jsx(Alert, {
                    variant: "warning",
                    title: "Warning",
                    children: "Please be careful before proceeding.",
                  }),
                  _jsx(Alert, {
                    variant: "destructive",
                    title: "Error",
                    children: "Something went horribly wrong.",
                  }),
                ],
              }),
            ],
          }),
          _jsxs("div", {
            className: "pt-8",
            children: [
              _jsx(Typography, {
                variant: "h4",
                className: "mb-4",
                children: "Cards",
              }),
              _jsxs(Card, {
                className: "max-w-sm",
                children: [
                  _jsxs(CardHeader, {
                    children: [
                      _jsx(CardTitle, { children: "Create project" }),
                      _jsx(CardDescription, {
                        children: "Deploy your new project in one-click.",
                      }),
                    ],
                  }),
                  _jsx(CardContent, {
                    children: _jsx(FormField, {
                      label: "Name",
                      className: "mb-4",
                      children: _jsx(Input, { placeholder: "Next.js App" }),
                    }),
                  }),
                  _jsxs(CardFooter, {
                    className: "flex justify-between",
                    children: [
                      _jsx(Button, { variant: "outline", children: "Cancel" }),
                      _jsx(Button, { children: "Deploy" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsxs("section", {
        className: "space-y-6",
        children: [
          _jsx(Typography, { variant: "h2", children: "Organisms" }),
          _jsxs("div", {
            className: "space-y-4",
            children: [
              _jsx(Typography, { variant: "h4", children: "Modals" }),
              _jsx(Button, {
                onClick: () => setIsModalOpen(true),
                children: "Open Modal",
              }),
              _jsxs(Modal, {
                isOpen: isModalOpen,
                onClose: () => setIsModalOpen(false),
                title: "Confirm Action",
                children: [
                  _jsx("div", {
                    className: "py-4 text-muted-foreground",
                    children:
                      "Are you sure you want to completely delete this account? This action cannot be undone.",
                  }),
                  _jsxs("div", {
                    className: "flex justify-end gap-2 mt-4",
                    children: [
                      _jsx(Button, {
                        variant: "outline",
                        onClick: () => setIsModalOpen(false),
                        children: "Cancel",
                      }),
                      _jsx(Button, {
                        variant: "danger",
                        onClick: () => setIsModalOpen(false),
                        children: "Delete Account",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default KitchenSinkPage;
