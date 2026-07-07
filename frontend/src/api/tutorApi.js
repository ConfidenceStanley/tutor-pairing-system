import api from "./axios";

export const searchTutors = async (params = {}) => {
  // Remove empty string values before sending
  const cleanParams = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      cleanParams[key] = value;
    }
  });

  const response = await api.get("/tutors", { params: cleanParams });
  return response.data;
};

export const getTutor = async (id) => {
  const response = await api.get(`/tutors/${id}`);
  return response.data;
};