import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  Search,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (user?.role === "student") return "/student/dashboard";
    if (user?.role === "tutor") return "/tutor/dashboard";
    if (user?.role === "admin") return "/admin/dashboard";
    return "/";
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-surface-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors duration-200">
            <GraduationCap size={20} />
          </div>
          <span className="font-bold text-lg text-surface-800 tracking-tight">
            Tutor<span className="text-primary-600">Pair</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {user.role === "student" && (
                <Link
                  to="/tutors"
                  className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
                >
                  <Search size={15} />
                  <span>Find Tutors</span>
                </Link>
              )}

              <Link
                to="/messages"
                className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                <MessageSquare size={15} />
                <span>Messages</span>
              </Link>

              <button
                onClick={() => navigate(getDashboardLink())}
                className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </button>

              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-surface-200">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-primary-200">
                    <span className="text-primary-700 text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-surface-700">
                  {user.name?.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-surface-400 hover:text-danger p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-surface-600 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm shadow-primary-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-surface-700 hover:bg-surface-100 transition-colors"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-surface-100 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl mb-3">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-surface-800">{user.name}</p>
                    <p className="text-xs text-surface-500 capitalize">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate(getDashboardLink());
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-3 text-sm text-surface-700 hover:text-primary-600 px-3 py-3 rounded-xl hover:bg-primary-50 transition-all duration-200"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </button>

                {user.role === "student" && (
                  <Link
                    to="/tutors"
                    onClick={closeMenu}
                    className="w-full flex items-center gap-3 text-sm text-surface-700 hover:text-primary-600 px-3 py-3 rounded-xl hover:bg-primary-50 transition-all duration-200"
                  >
                    <Search size={17} />
                    Find Tutors
                  </Link>
                )}

                <Link
                  to="/messages"
                  onClick={closeMenu}
                  className="w-full flex items-center gap-3 text-sm text-surface-700 hover:text-primary-600 px-3 py-3 rounded-xl hover:bg-primary-50 transition-all duration-200"
                >
                  <MessageSquare size={17} />
                  Messages
                </Link>

                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-3 text-sm text-danger hover:bg-red-50 px-3 py-3 rounded-xl transition-all duration-200 mt-2"
                >
                  <LogOut size={17} />
                  Log out
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block w-full text-center text-sm font-medium text-surface-700 hover:text-primary-600 py-3 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block w-full text-center text-sm font-medium bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-sm shadow-primary-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;