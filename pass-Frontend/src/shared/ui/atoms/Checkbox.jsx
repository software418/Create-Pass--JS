import React from "react";
import { cn } from "../../utils/cn";
export const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "checkbox",
        className,
      )}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";
