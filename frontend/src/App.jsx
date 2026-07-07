import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import EditProfile from "./pages/EditProfile";
import TutorSubjects from "./pages/TutorSubjects";
import TutorAvailability from "./pages/TutorAvailability";
import TutorPublicProfile from "./pages/TutorPublicProfile";
import SearchTutors from "./pages/SearchTutors";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tutor/profile/:id" element={<TutorPublicProfile />} />
          <Route path="/tutors" element={<SearchTutors />} />

          {/* Protected - Any authenticated user */}
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected - Students only */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Protected - Tutors only */}
          <Route
            path="/tutor/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["tutor"]}>
                  <TutorDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tutor/subjects"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["tutor"]}>
                  <TutorSubjects />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tutor/availability"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["tutor"]}>
                  <TutorAvailability />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;