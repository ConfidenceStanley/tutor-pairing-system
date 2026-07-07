import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import BookSession from "./pages/BookSession";
import PaymentCallback from "./pages/PaymentCallback";
import PaymentHistory from "./pages/PaymentHistory";
import Messages from "./pages/Messages";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminPayments from "./pages/admin/AdminPayments";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Toaster must be inside Router so it works on all pages */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              style: {
                background: "#ecfdf5",
                color: "#065f46",
                border: "1px solid #a7f3d0",
              },
            },
            error: {
              style: {
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tutors" element={<SearchTutors />} />
          <Route path="/tutor/profile/:id" element={<TutorPublicProfile />} />

          {/* Protected - Any authenticated user */}
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/callback"
            element={
              <ProtectedRoute>
                <PaymentCallback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
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
          <Route
            path="/book-session/:tutorId"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["student"]}>
                  <BookSession />
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

          {/* Protected - Admin only */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sessions"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminSessions />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminPayments />
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