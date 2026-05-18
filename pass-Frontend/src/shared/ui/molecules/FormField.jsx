import { Label } from "../atoms/Label";
import { cn } from "../../utils/cn";
// FIX: Added 'htmlFor' to the destructured arguments list below
export const FormField = ({ label, error, className, htmlFor, children }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {
        <Label htmlFor={htmlFor} className={error ? "text-destructive" : ""}>
          {label}
        </Label>
      }
      {children}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
};
