import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  BookOpen,
  GraduationCap,
  Clock,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "student") return "/student/dashboard";
    if (user.role === "tutor") return "/tutor/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/";
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    logout();
  };

  return (
    <nav className="bg-white border-b border-surface-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-primary-600 font-bold text-xl"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            TutorPair
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/tutors"
              className="text-surface-600 hover:text-primary-600 font-medium transition-colors text-sm"
            >
              Find Tutors
            </Link>

            {user ? (
              /* Logged in - User Menu */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-50 transition-colors"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-600">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-surface-800 leading-tight">
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-xs text-surface-400 capitalize leading-tight">
                      {user.role}
                    </p>
                  </div>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-surface-100 py-2 z-20 animate-scale-in">
                      {/* User info */}
                      <div className="px-4 py-2 border-b border-surface-100 mb-1">
                        <p className="text-sm font-semibold text-surface-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-surface-400">{user.email}</p>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>

                      <Link
                        to="/profile/edit"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <User size={16} />
                        Edit Profile
                      </Link>

                      <Link
                        to="/payments"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <CreditCard size={16} />
                        {user.role === "tutor" ? "Earnings" : "Payments"}
                      </Link>

                      {/* Tutor-only menu items */}
                      {user.role === "tutor" && (
                        <>
                          <Link
                            to="/tutor/subjects"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          >
                            <BookOpen size={16} />
                            My Subjects
                          </Link>

                          <Link
                            to="/tutor/availability"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          >
                            <Clock size={16} />
                            Availability
                          </Link>
                        </>
                      )}

                      <div className="border-t border-surface-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Logged out */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-surface-600 hover:text-primary-600 font-medium transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-50"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-100 bg-white animate-fade-in-up">
          <div className="px-6 py-4 space-y-1">
            <Link
              to="/tutors"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-surface-700 font-medium"
            >
              Find Tutors
            </Link>

            {user ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 py-3 border-b border-surface-100 mb-2">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-surface-800">{user.name}</p>
                    <p className="text-sm text-surface-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-surface-700"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  to="/profile/edit"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-surface-700"
                >
                  <User size={18} />
                  Edit Profile
                </Link>

                <Link
                  to="/payments"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-surface-700"
                >
                  <CreditCard size={18} />
                  {user.role === "tutor" ? "Earnings" : "Payments"}
                </Link>

                {user.role === "tutor" && (
                  <>
                    <Link
                      to="/tutor/subjects"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2.5 text-surface-700"
                    >
                      <BookOpen size={18} />
                      My Subjects
                    </Link>
                    <Link
                      to="/tutor/availability"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2.5 text-surface-700"
                    >
                      <Clock size={18} />
                      Availability
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2.5 text-danger w-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-surface-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-primary-600 font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;