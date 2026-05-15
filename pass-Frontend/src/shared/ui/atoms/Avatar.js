import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { cn } from '../../utils/cn';
export const Avatar = ({ src, alt, fallback, size = 'md', className }) => {
    const [error, setError] = useState(false);
    const sizes = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
    };
    return (_jsx("div", { className: cn('relative flex shrink-0 overflow-hidden rounded-full bg-muted flex-align-center justify-center', sizes[size], className), children: src && !error ? (_jsx("img", { src: src, alt: alt, className: "aspect-square h-full w-full object-cover", onError: () => setError(true) })) : (_jsx("span", { className: "flex h-full w-full items-center justify-center font-medium text-muted-foreground uppercase", children: fallback.substring(0, 2) })) }));
};
