import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, FileText, Users } from "lucide-react";
import { toast } from "sonner";

export default function Layout({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";
  const hasStaffAccess = isAdmin || (user?.role === "staff" && user?.access_level === "full");

  const navItems = [
    ...(isAdmin
      ? [{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
      : []),
    { path: "/subscriptions", label: "Subscriptions", icon: FileText },
    ...(hasStaffAccess ? [{ path: "/staff", label: "Staff", icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-slate-900">
                Subscription Manager
              </h1>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className={`gap-2 ${isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="gap-2 text-slate-600 hover:text-slate-900"
                data-testid="profile-button"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 border-slate-300"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
