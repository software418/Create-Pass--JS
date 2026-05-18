import React, { useState } from "react";
import { Input } from "../atoms/Input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";
export const PasswordField = React.forwardRef(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative">
        {
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            {...props}
          />
        }
        {
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      </div>
    );
  },
);
PasswordField.displayName = "PasswordField";
