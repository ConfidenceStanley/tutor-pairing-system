import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authApi";
import AuthLayout from "../layouts/AuthLayout";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      login(response.data, response.data.token);
      toast.success(`Welcome back, ${response.data.name.split(" ")[0]}!`);
      if (response.data.role === "student") navigate("/student/dashboard");
      if (response.data.role === "tutor") navigate("/tutor/dashboard");
      if (response.data.role === "admin") navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-surface-900 mb-1">
            Welcome back
          </h2>
          <p className="text-surface-500 text-sm">
            Do not have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-medium hover:underline"
            >
              Sign up free
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-surface-200 rounded-xl px-4 py-3 pr-11 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-danger text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-primary-200 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;