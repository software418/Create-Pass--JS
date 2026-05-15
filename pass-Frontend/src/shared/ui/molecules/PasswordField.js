import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';
export const PasswordField = React.forwardRef(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (_jsxs("div", { className: "relative", children: [_jsx(Input, { type: showPassword ? 'text' : 'password', className: cn('pr-10', className), ref: ref, ...props }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none", children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }));
});
PasswordField.displayName = 'PasswordField';
