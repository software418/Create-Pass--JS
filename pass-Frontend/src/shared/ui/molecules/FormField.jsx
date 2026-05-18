import { Label } from "../atoms/Label";
import { cn } from "../../utils/cn";
// FIX: Added 'htmlFor' to the destructured arguments list below
export const FormField = ({ label, error, className, htmlFor, children }) => {
  return (
    <div className={cn("form-field", className)}>
      {
        <Label htmlFor={htmlFor} className={error ? "form-field-label-error" : ""}>
          {label}
        </Label>
      }
      {children}
      {error && <p className="form-field-error-text">{error}</p>}
    </div>
  );
};
