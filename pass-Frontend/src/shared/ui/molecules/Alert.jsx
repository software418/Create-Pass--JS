import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "../../utils/cn";
const icons = {
  default: <Info className="h-4 w-4" />,
  destructive: <XCircle className="h-4 w-4" />,
  success: <CheckCircle className="h-4 w-4" />,
  warning: <AlertCircle className="h-4 w-4" />,
};
export const Alert = React.forwardRef(
  ({ className, variant = "default", title, children, ...props }, ref) => {
    const variants = {
      default: "bg-background text-foreground",
      destructive:
        "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      success:
        "border-green-500/50 text-green-600 dark:text-green-400 [&>svg]:text-green-600",
      warning:
        "border-yellow-500/50 text-yellow-600 dark:text-yellow-400 [&>svg]:text-yellow-600",
    };
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:-translate-y-0.75 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
          variants[variant],
          className,
        )}
        {...props}
      >
        {icons[variant]}
        {title && (
          <h5 className="mb-1 font-medium leading-none tracking-tight">
            {title}
          </h5>
        )}
        {<div className="text-sm [&_p]:leading-relaxed">{children}</div>}
      </div>
    );
  },
);
Alert.displayName = "Alert";
