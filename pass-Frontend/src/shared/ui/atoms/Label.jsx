import React from "react";
import { cn } from "../../utils/cn";
export const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "label",
        className,
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";
