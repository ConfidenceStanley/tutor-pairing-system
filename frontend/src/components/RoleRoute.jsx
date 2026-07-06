import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
    if (user.role === "tutor") return <Navigate to="/tutor/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;