import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (
      storedUser &&
      storedToken &&
      storedToken !== "undefined" &&
      storedUser !== "undefined"
    ) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    setLoading(false);

    // Listen for forced logout from axios interceptor
    const handleForceLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener("auth:logout", handleForceLogout);

    return () => {
      window.removeEventListener("auth:logout", handleForceLogout);
    };
  }, []);

  const login = (userData, tokenData) => {
    if (!userData || !tokenData || tokenData === "undefined") {
      return;
    }
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (userData) => {
    if (!userData) return;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};