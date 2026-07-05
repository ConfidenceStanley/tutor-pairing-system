import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
    if (user.role === "tutor") return <Navigate to="/tutor/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;