import { cn } from "../../utils/cn";
import { X } from "lucide-react";
export const Modal = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      }
      {
        <div
          className={cn(
            "z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
            className,
          )}
        >
          {(title || onClose) && (
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              {title && (
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {title}
                </h2>
              )}
              {
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                  {<X className="h-4 w-4" />}
                  {<span className="sr-only">Close</span>}
                </button>
              }
            </div>
          )}
          {children}
        </div>
      }
    </div>
  );
};
