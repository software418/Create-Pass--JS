import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../../utils/cn';
export const Navbar = ({ className, children }) => {
    return (_jsx("header", { className: cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60", className), children: _jsx("div", { className: "container flex h-14 items-center px-4 md:px-8", children: children }) }));
};
