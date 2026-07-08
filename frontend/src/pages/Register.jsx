import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  UserRound,
  BookOpen,
  Plus,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../api/authApi";
import { DEPARTMENTS, LEVELS } from "../utils/constants";
import AuthLayout from "../layouts/AuthLayout";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const removeSubject = (subject) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }
  };

  const onSubmit = async (data) => {
    if (selectedRole === "tutor" && subjects.length === 0) {
      toast.error("Please add at least one subject you can teach");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...data,
        role: selectedRole,
        subjects: selectedRole === "tutor" ? subjects : [],
      };
      const response = await registerUser(payload);

      // token lives inside response.data alongside user fields
      const { token, ...userData } = response.data;

      login(userData, token);
      toast.success("Account created successfully!");

      if (selectedRole === "student") navigate("/student/dashboard");
      else if (selectedRole === "tutor") navigate("/tutor/dashboard");
      else navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-surface-200 rounded-xl px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white";

  const selectClass =
    "w-full border border-surface-200 rounded-xl px-4 py-3 text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white";

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-surface-900 mb-1">
            Create an account
          </h2>
          <p className="text-surface-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {!selectedRole ? (
          <div className="animate-scale-in">
            <p className="text-sm font-medium text-surface-700 mb-4">
              I am registering as a:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole("student")}
                className="group border-2 border-surface-200 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
              >
                <div className="w-14 h-14 bg-surface-100 group-hover:bg-primary-100 rounded-2xl flex items-center justify-center transition-colors duration-200">
                  <UserRound
                    size={28}
                    className="text-surface-500 group-hover:text-primary-600 transition-colors duration-200"
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-surface-800 text-sm">
                    Student
                  </p>
                  <p className="text-xs text-surface-400 mt-0.5">
                    I need academic help
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("tutor")}
                className="group border-2 border-surface-200 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
              >
                <div className="w-14 h-14 bg-surface-100 group-hover:bg-primary-100 rounded-2xl flex items-center justify-center transition-colors duration-200">
                  <BookOpen
                    size={28}
                    className="text-surface-500 group-hover:text-primary-600 transition-colors duration-200"
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-surface-800 text-sm">
                    Tutor
                  </p>
                  <p className="text-xs text-surface-400 mt-0.5">
                    I want to teach
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 animate-scale-in"
          >
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-1 text-xs text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ArrowLeft size={13} />
                Back
              </button>
              <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full capitalize ml-auto">
                {selectedRole}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className={inputClass}
                  {...register("name", { required: "Full name is required" })}
                />
                {errors.name && (
                  <p className="text-danger text-xs mt-1.5">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={inputClass}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-danger text-xs mt-1.5">
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
                    placeholder="Minimum 6 characters"
                    className={`${inputClass} pr-11`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Department
                  </label>
                  <select
                    className={selectClass}
                    {...register("department", { required: "Required" })}
                  >
                    <option value="">Select</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-danger text-xs mt-1.5">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Level
                  </label>
                  <select
                    className={selectClass}
                    {...register("level", { required: "Required" })}
                  >
                    <option value="">Select</option>
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                  {errors.level && (
                    <p className="text-danger text-xs mt-1.5">
                      {errors.level.message}
                    </p>
                  )}
                </div>
              </div>

              {selectedRole === "tutor" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell students about yourself and your teaching style..."
                      className={`${inputClass} resize-none`}
                      {...register("bio")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Session Rate (NGN per session)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2500"
                      className={inputClass}
                      {...register("sessionRate")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Subjects You Can Teach
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Data Structures"
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={addSubject}
                        className="bg-primary-600 text-white px-3 py-2 rounded-xl hover:bg-primary-700 transition-colors flex-shrink-0"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {subjects.map((subject) => (
                          <span
                            key={subject}
                            className="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-100"
                          >
                            {subject}
                            <button
                              type="button"
                              onClick={() => removeSubject(subject)}
                              className="hover:text-danger transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
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
                <UserPlus size={16} />
              )}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default Register;