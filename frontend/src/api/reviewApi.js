import api from "./axios";

export const createReview = async (data) => {
  const response = await api.post("/reviews", data);
  return response.data;
};

export const getTutorReviews = async (tutorId) => {
  const response = await api.get(`/reviews/tutor/${tutorId}`);
  return response.data;
};

export const getSessionReview = async (sessionId) => {
  const response = await api.get(`/reviews/session/${sessionId}`);
  return response.data;
};