import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  BookOpen,
  Camera,
  Save,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyProfile, updateMyProfile, uploadProfileImage } from "../api/profileApi";
import MainLayout from "../layouts/MainLayout";

const DEPARTMENTS = [
  "Computer Science",
  "Business Administration",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Accounting",
  "Mass Communication",
  "Public Administration",
  "Science Laboratory Technology",
  "Statistics",
];

const LEVELS = ["ND1", "ND2", "HND1", "HND2"];

const EditProfile = () => {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        const data = response.data;
        setProfileData(data);
        setImagePreview(data.profileImage || null);

        // Pre-fill form
        reset({
          name: data.name,
          department: data.department,
          level: data.level,
          bio: data.bio || "",
          sessionRate: data.sessionRate || 0,
        });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [reset]);

  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to Cloudinary
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploadingImage(true);
    try {
      const response = await uploadProfileImage(selectedFile);

      // Update auth context with new image
      const updatedUser = { ...user, profileImage: response.data.profileImage };
      login(updatedUser, token);

      setSelectedFile(null);
      toast.success("Profile image updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
      // Revert preview
      setImagePreview(profileData?.profileImage || null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save profile details
  const onSubmit = async (formData) => {
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        department: formData.department,
        level: formData.level,
      };

      // Add tutor-only fields
      if (profileData?.role === "tutor") {
        payload.bio = formData.bio;
        payload.sessionRate = Number(formData.sessionRate);
      }

      const response = await updateMyProfile(payload);

      // Update auth context
      const updatedUser = { ...user, ...response.data };
      login(updatedUser, token);

      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoadingProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-surface-500">Loading your profile...</p>
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
            onClick={() =>
              navigate(
                profileData?.role === "tutor"
                  ? "/tutor/dashboard"
                  : "/student/dashboard"
              )
            }
            className="flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">Edit Profile</h1>
          <p className="text-surface-500 mt-1">
            Keep your profile up to date so students can find you
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
            <h2 className="text-lg font-semibold text-surface-800 mb-4">
              Profile Photo
            </h2>

            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center border-4 border-primary-200">
                    <span className="text-2xl font-bold text-primary-600">
                      {getInitials(profileData?.name)}
                    </span>
                  </div>
                )}

                {/* Camera overlay button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* Upload controls */}
              <div className="flex-1">
                <p className="text-surface-600 text-sm mb-3">
                  Upload a clear photo of yourself. Max 5MB. JPG, PNG, or WebP.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border-2 border-primary-300 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors"
                  >
                    Choose Photo
                  </button>

                  {selectedFile && (
                    <button
                      onClick={handleImageUpload}
                      disabled={isUploadingImage}
                      className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {isUploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Upload Photo"
                      )}
                    </button>
                  )}
                </div>

                {selectedFile && (
                  <p className="text-surface-400 text-xs mt-2">
                    Selected: {selectedFile.name} — Click "Upload Photo" to save
                  </p>
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Profile Details Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
              <h2 className="text-lg font-semibold text-surface-800 mb-6">
                Personal Information
              </h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                    />
                    <input
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      type="text"
                      placeholder="Your full name"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        errors.name
                          ? "border-danger bg-red-50"
                          : "border-surface-200 bg-surface-50 focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-danger">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                    />
                    <input
                      type="email"
                      value={profileData?.email || ""}
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 bg-surface-100 text-surface-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-surface-400">
                    Email cannot be changed
                  </p>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Department
                  </label>
                  <div className="relative">
                    <BookOpen
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none z-10"
                    />
                    <select
                      {...register("department", {
                        required: "Department is required",
                      })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none ${
                        errors.department
                          ? "border-danger bg-red-50"
                          : "border-surface-200 bg-surface-50 focus:bg-white"
                      }`}
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <p className="mt-1.5 text-sm text-danger">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Academic Level
                  </label>
                  <div className="relative">
                    <GraduationCap
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none z-10"
                    />
                    <select
                      {...register("level", {
                        required: "Level is required",
                      })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none ${
                        errors.level
                          ? "border-danger bg-red-50"
                          : "border-surface-200 bg-surface-50 focus:bg-white"
                      }`}
                    >
                      <option value="">Select level</option>
                      {LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.level && (
                    <p className="mt-1.5 text-sm text-danger">
                      {errors.level.message}
                    </p>
                  )}
                </div>

                {/* Tutor-only fields */}
                {profileData?.role === "tutor" && (
                  <>
                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Bio{" "}
                        <span className="text-surface-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        {...register("bio", {
                          maxLength: {
                            value: 500,
                            message: "Bio cannot exceed 500 characters",
                          },
                        })}
                        rows={4}
                        placeholder="Tell students about yourself, your teaching style, experience..."
                        className={`w-full px-4 py-3 rounded-xl border text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                          errors.bio
                            ? "border-danger bg-red-50"
                            : "border-surface-200 bg-surface-50 focus:bg-white"
                        }`}
                      />
                      {errors.bio && (
                        <p className="mt-1.5 text-sm text-danger">
                          {errors.bio.message}
                        </p>
                      )}
                    </div>

                    {/* Session Rate */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Session Rate (NGN)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 font-medium text-sm">
                          ₦
                        </span>
                        <input
                          {...register("sessionRate", {
                            min: {
                              value: 0,
                              message: "Session rate cannot be negative",
                            },
                            max: {
                              value: 100000,
                              message: "Session rate seems too high",
                            },
                          })}
                          type="number"
                          min="0"
                          placeholder="0"
                          className={`w-full pl-8 pr-4 py-3 rounded-xl border text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                            errors.sessionRate
                              ? "border-danger bg-red-50"
                              : "border-surface-200 bg-surface-50 focus:bg-white"
                          }`}
                        />
                      </div>
                      {errors.sessionRate && (
                        <p className="mt-1.5 text-sm text-danger">
                          {errors.sessionRate.message}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-surface-400">
                        Enter 0 if you offer free sessions
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
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
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      profileData?.role === "tutor"
                        ? "/tutor/dashboard"
                        : "/student/dashboard"
                    )
                  }
                  className="px-6 py-3 border border-surface-200 text-surface-600 rounded-xl font-medium hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          {/* Quick Links for Tutors */}
          {profileData?.role === "tutor" && (
            <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6">
              <h2 className="text-lg font-semibold text-primary-800 mb-2">
                Additional Tutor Settings
              </h2>
              <p className="text-primary-600 text-sm mb-4">
                Manage your subjects and availability schedule separately.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate("/tutor/subjects")}
                  className="px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors"
                >
                  Manage Subjects
                </button>
                <button
                  onClick={() => navigate("/tutor/availability")}
                  className="px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors"
                >
                  Set Availability
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProfile;