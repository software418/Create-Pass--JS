import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';
export const Modal = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsxs("div", { className: cn('z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg', className), children: [(title || onClose) && (_jsxs("div", { className: "flex flex-col space-y-1.5 text-center sm:text-left", children: [title && _jsx("h2", { className: "text-lg font-semibold leading-none tracking-tight", children: title }), _jsxs("button", { onClick: onClose, className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [_jsx(X, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Close" })] })] })), children] })] }));
};
