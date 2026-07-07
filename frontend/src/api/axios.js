import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginRoute = error.config?.url?.includes("/auth/login");
    const token = localStorage.getItem("token");
    const hasValidToken = token && token !== "undefined";

    // Only clear storage on 401 for non-login routes with a valid token
    // Do NOT use window.location.href — let ProtectedRoute handle redirect
    if (status === 401 && !isLoginRoute && hasValidToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Dispatch a custom event so AuthContext can react without hard refresh
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  }
);

export default api;