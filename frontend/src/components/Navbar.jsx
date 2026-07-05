import { Link } from "react-router-dom";
import { GraduationCap, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <GraduationCap size={28} />
          <span>TutorPair</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-600 text-sm flex items-center gap-1">
                <User size={16} />
                {user.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;