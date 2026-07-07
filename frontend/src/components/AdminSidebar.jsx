import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  GraduationCap,
  X,
} from "lucide-react";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/sessions", label: "Sessions", icon: Calendar },
  { path: "/admin/payments", label: "Payments", icon: CreditCard },
];

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-surface-100">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 text-primary-600 font-bold text-lg"
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          Admin Panel
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100 text-surface-500"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-50 text-primary-700 shadow-sm border border-primary-100"
                  : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-surface-100">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="text-xs text-surface-400 hover:text-primary-600 transition-colors"
        >
          ← Back to Main Site
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-white border-r border-surface-100 min-h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl animate-slide-in-right">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default AdminSidebar;