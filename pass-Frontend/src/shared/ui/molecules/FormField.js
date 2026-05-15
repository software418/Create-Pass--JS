import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Label } from '../atoms/Label';
import { cn } from '../../utils/cn';
// FIX: Added 'htmlFor' to the destructured arguments list below
export const FormField = ({ label, error, className, htmlFor, children }) => {
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsx(Label, { htmlFor: htmlFor, className: error ? 'text-destructive' : '', children: label }), children, error && _jsx("p", { className: "text-sm font-medium text-destructive", children: error })] }));
};
