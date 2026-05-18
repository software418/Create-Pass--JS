import { Outlet, Link } from "react-router-dom";
import { Navbar } from "../ui/organisms/Navbar";
import { Sidebar, SidebarItem, SidebarGroup } from "../ui/organisms/Sidebar";
import {
  Package,
  LogOut,
  UserRoundCog,
  Factory,
  FilePlus,
  Users,
  DoorOpen,
  Presentation,
  Settings,
} from "lucide-react";
import { Button } from "../ui/atoms/Button";
import { Avatar } from "../ui/atoms/Avatar";
export const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {
        <Navbar>
          {
            <div className="dashboard-navbar-content">
              {<div className="dashboard-logo">VMS</div>}
              {
                <div className="dashboard-actions">
                  {
                    <Button variant="ghost" size="icon">
                      {<LogOut className="dashboard-icon" />}
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
        <div className="dashboard-body">
          {
            <Sidebar>
              <Link to="/dashboard">
                <SidebarItem icon={Presentation} label="Dashboard" />
              </Link>

              <Link to="/create-pass">
                <SidebarItem icon={FilePlus} label="Create Pass" />
              </Link>

              {/* Settings group — expands on click */}
              <SidebarGroup icon={Settings} label="Settings">
                <Link to="/employee-config">
                  <SidebarItem icon={UserRoundCog} label="Employee" />
                </Link>
                <Link to="/visiting-area-config">
                  <SidebarItem icon={Factory} label="Visiting Area" />
                </Link>
                <Link to="/visitor-type-config">
                  <SidebarItem icon={Users} label="Visitor Type" />
                </Link>
                <Link to="/purpose-config">
                  <SidebarItem icon={DoorOpen} label="Purpose" />
                </Link>
                <Link to="/carry-with-config">
                  <SidebarItem icon={Package} label="Carry With" />
                </Link>
              </SidebarGroup>
            </Sidebar>
          }
          {<main className="dashboard-main">{<Outlet />}</main>}
        </div>
      }
    </div>
  );
};
