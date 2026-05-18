import { cn } from "../../utils/cn";
export const Sidebar = ({ className, children }) => {
  return (
    <div
      className={cn(
        "pb-12 min-h-screen border-r hidden md:block w-64",
        className,
      )}
    >
      {<div className="space-y-4 py-4">{children}</div>}
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SidebarItem = ({ icon: Icon, label, isActive }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2 mx-2 rounded-md cursor-pointer transition-colors",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </div>
  );
};
