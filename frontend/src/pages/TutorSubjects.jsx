import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, X, BookOpen, Save, ArrowLeft } from "lucide-react";
import { getMyProfile, updateSubjects } from "../api/profileApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";

const SUGGESTED_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English Language",
  "Data Structures",
  "Algorithms",
  "Database Management",
  "Web Development",
  "Programming Fundamentals",
  "Computer Networks",
  "Operating Systems",
  "Statistics",
  "Economics",
  "Accounting",
  "Calculus",
  "Linear Algebra",
  "Digital Electronics",
  "Circuit Theory",
  "Technical Drawing",
];

const TutorSubjects = () => {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load current subjects
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setSubjects(response.data.subjects || []);
      } catch (error) {
        toast.error("Failed to load subjects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Add subject from input
  const addSubject = (subject) => {
    const trimmed = subject.trim();
    if (!trimmed) return;

    if (subjects.length >= 10) {
      toast.error("Maximum 10 subjects allowed");
      return;
    }

    if (subjects.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("This subject is already added");
      return;
    }

    setSubjects([...subjects, trimmed]);
    setInputValue("");
  };

  // Handle Enter key in input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject(inputValue);
    }
    if (e.key === ",") {
      e.preventDefault();
      addSubject(inputValue);
    }
  };

  // Remove a subject
  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  // Add suggested subject
  const addSuggested = (subject) => {
    addSubject(subject);
  };

  // Save subjects
  const handleSave = async () => {
    if (subjects.length === 0) {
      toast.error("Please add at least one subject");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateSubjects(subjects);

      // Update auth context
      const updatedUser = { ...user, subjects: response.data.subjects };
      login(updatedUser, token);

      toast.success("Subjects updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update subjects");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered suggestions (not already added)
  const filteredSuggestions = SUGGESTED_SUBJECTS.filter(
    (s) => !subjects.some((sub) => sub.toLowerCase() === s.toLowerCase())
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-surface-500">Loading your subjects...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/tutor/dashboard")}
            className="flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">My Subjects</h1>
          <p className="text-surface-500 mt-1">
            Add the subjects you can tutor. Students will find you based on these.
          </p>
        </div>

        <div className="space-y-6">
          {/* Subject Input Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
            <h2 className="text-lg font-semibold text-surface-800 mb-2">
              Add Subjects
            </h2>
            <p className="text-surface-500 text-sm mb-5">
              Type a subject name and press Enter or comma to add it. Max 10 subjects.
            </p>

            {/* Input */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <BookOpen
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Mathematics, Physics..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 bg-surface-50 text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={() => addSubject(inputValue)}
                disabled={!inputValue.trim()}
                className="flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-40"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {/* Current Subjects Tags */}
            {subjects.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-surface-600 mb-3">
                  Your subjects ({subjects.length}/10):
                </p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {subject}
                      <button
                        onClick={() => removeSubject(index)}
                        className="text-primary-500 hover:text-primary-800 transition-colors ml-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {subjects.length === 0 && (
              <div className="mt-5 p-4 bg-surface-50 rounded-xl border border-dashed border-surface-200 text-center">
                <BookOpen size={24} className="text-surface-300 mx-auto mb-2" />
                <p className="text-surface-400 text-sm">
                  No subjects added yet. Add from the suggestions below or type your own.
                </p>
              </div>
            )}
          </div>

          {/* Suggested Subjects */}
          {filteredSuggestions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
              <h2 className="text-lg font-semibold text-surface-800 mb-4">
                Quick Add Suggestions
              </h2>
              <div className="flex flex-wrap gap-2">
                {filteredSuggestions.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => addSuggested(subject)}
                    disabled={subjects.length >= 10}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-100 text-surface-600 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={12} />
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || subjects.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 disabled:opacity-60 shadow-sm"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Subjects
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/tutor/dashboard")}
              className="px-6 py-3 border border-surface-200 text-surface-600 rounded-xl font-medium hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorSubjects;