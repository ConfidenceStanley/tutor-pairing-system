import api from "./axios";

// Get my profile
export const getMyProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data;
};

// Update my profile (name, department, level, bio, sessionRate)
export const updateMyProfile = async (profileData) => {
  const response = await api.put("/profile/me", profileData);
  return response.data;
};

// Upload profile image
export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("profileImage", imageFile);

  const response = await api.post("/profile/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update availability (tutor only)
export const updateAvailability = async (availability) => {
  const response = await api.put("/profile/availability", { availability });
  return response.data;
};

// Update subjects (tutor only)
export const updateSubjects = async (subjects) => {
  const response = await api.put("/profile/subjects", { subjects });
  return response.data;
};

// Get public tutor profile
export const getTutorProfile = async (tutorId) => {
  const response = await api.get(`/profile/tutor/${tutorId}`);
  return response.data;
};