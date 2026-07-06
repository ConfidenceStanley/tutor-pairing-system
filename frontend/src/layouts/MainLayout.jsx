import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

const MainLayout = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen bg-surface-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#262626",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            fontSize: "14px",
            padding: "12px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          },
          success: {
            iconTheme: {
              primary: "#8b5cf6",
              secondary: "#fff",
            },
          },
        }}
      />
      <Navbar />
      {fullWidth ? (
        <main className="animate-fade-in">{children}</main>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
          {children}
        </main>
      )}
    </div>
  );
};

export default MainLayout;