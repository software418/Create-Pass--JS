import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../atoms/Input';
import { cn } from '../../utils/cn';
export const SearchInput = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsxs("div", { className: "relative w-full max-w-sm", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { type: "search", placeholder: "Search...", className: cn('pl-8', className), ref: ref, ...props })] }));
});
SearchInput.displayName = 'SearchInput';
