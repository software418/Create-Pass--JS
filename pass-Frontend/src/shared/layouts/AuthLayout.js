import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
export const AuthLayout = () => {
  return _jsx("div", {
    className: "min-h-screen flex items-center justify-center bg-muted/30 px-4",
    children: _jsxs("div", {
      className: "w-full max-w-md",
      children: [
        _jsxs("div", {
          className: "mb-8 text-center",
          children: [
            _jsx("h1", {
              className: "text-3xl font-extrabold tracking-tight text-primary",
              children: "MERN Boilerplate",
            }),
            _jsx("p", {
              className: "text-muted-foreground mt-2",
              children: "Sign in to your account to continue",
            }),
          ],
        }),
        _jsx(Outlet, {}),
      ],
    }),
  });
};
