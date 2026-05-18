import React from "react";
import { Search } from "lucide-react";
import { Input } from "../atoms/Input";
import { cn } from "../../utils/cn";
export const SearchInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="relative w-full max-w-sm">
      {
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      }
      {
        <Input
          type="search"
          placeholder="Search..."
          className={cn("pl-8", className)}
          ref={ref}
          {...props}
        />
      }
    </div>
  );
});
SearchInput.displayName = "SearchInput";
