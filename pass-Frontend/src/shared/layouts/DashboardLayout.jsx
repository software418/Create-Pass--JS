import { Outlet, Link } from "react-router-dom";
import { Navbar } from "../ui/organisms/Navbar";
import { Sidebar, SidebarItem } from "../ui/organisms/Sidebar";
import {
  Package,
  LogOut,
  UserRoundCog,
  Factory,
  FilePlus,
  Users,
  DoorOpen,
} from "lucide-react";
import { Button } from "../ui/atoms/Button";
import { Avatar } from "../ui/atoms/Avatar";
export const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-screen flex-col bg-surface overflow-hidden">
      {
        <Navbar>
          {
            <div className="flex flex-1 items-center justify-between">
              {
                <div className="font-bold text-xl tracking-tight text-primary">
                  VMS
                </div>
              }
              {
                <div className="flex items-center gap-4">
                  {
                    <Button variant="ghost" size="icon">
                      {<LogOut className="h-4 w-4" />}
                    </Button>
                  }
                  {<Avatar fallback="US" />}
                </div>
              }
            </div>
          }
        </Navbar>
      }
      {
        <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
          {
            <Sidebar>
              {
                <Link to="/create-pass">
                  {<SidebarItem icon={FilePlus} label="Create Pass" />}
                </Link>
              }
              {
                <Link to="/employee-config">
                  {<SidebarItem icon={UserRoundCog} label="Employee" />}
                </Link>
              }
              {
                <Link to="/visiting-area-config">
                  {<SidebarItem icon={Factory} label="Visiting Area" />}
                </Link>
              }
              {
                <Link to="/visitor-type-config">
                  {<SidebarItem icon={Users} label="Visitor type" />}
                </Link>
              }
              {
                <Link to="/purpose-config">
                  {<SidebarItem icon={DoorOpen} label="Purpose" />}
                </Link>
              }
              {
                <Link to="/carry-with-config">
                  {<SidebarItem icon={Package} label="Carry With" />}
                </Link>
              }
            </Sidebar>
          }
          {
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {<Outlet />}
            </main>
          }
        </div>
      }
    </div>
  );
};
