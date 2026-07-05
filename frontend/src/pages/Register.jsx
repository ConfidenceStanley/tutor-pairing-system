import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GraduationCap, UserRound, BookOpen, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../api/authApi";
import { DEPARTMENTS, LEVELS } from "../utils/constants";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

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
      login(response.data, response.data.token);
      toast.success("Account created successfully");

      if (selectedRole === "student") navigate("/student/dashboard");
      if (selectedRole === "tutor") navigate("/tutor/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg p-8">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-6">
          <GraduationCap size={26} />
          <span>TutorPair</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create an account</h2>
        <p className="text-gray-500 text-sm mb-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>

        {!selectedRole ? (
          <div>
            <p className="text-gray-700 font-medium mb-4">I am registering as a:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole("student")}
                className="border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <UserRound size={36} className="text-blue-600" />
                <span className="font-semibold text-gray-700">Student</span>
                <span className="text-xs text-gray-400 text-center">
                  I need help with my studies
                </span>
              </button>

              <button
                onClick={() => setSelectedRole("tutor")}
                className="border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <BookOpen size={36} className="text-blue-600" />
                <span className="font-semibold text-gray-700">Tutor</span>
                <span className="text-xs text-gray-400 text-center">
                  I want to teach and earn
                </span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">Registering as:</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {selectedRole}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs text-gray-400 hover:text-red-500 ml-auto"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("name", { required: "Full name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                {...register("department", { required: "Department is required" })}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                {...register("level", { required: "Level is required" })}
              >
                <option value="">Select level</option>
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>
              )}
            </div>

            {selectedRole === "tutor" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell students about yourself and your teaching style..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    {...register("bio")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Rate (NGN per session)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("sessionRate")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects You Can Teach
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. Data Structures"
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSubject}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {subjects.map((subject) => (
                        <span
                          key={subject}
                          className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                        >
                          {subject}
                          <button
                            type="button"
                            onClick={() => removeSubject(subject)}
                            className="hover:text-red-500"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;