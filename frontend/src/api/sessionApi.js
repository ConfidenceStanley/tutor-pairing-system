import api from "./axios";

export const createSession = async (data) => {
  const response = await api.post("/sessions", data);
  return response.data;
};

export const getMySessions = async (status) => {
  const params = status ? { status } : {};
  const response = await api.get("/sessions/my-sessions", { params });
  return response.data;
};

export const getSession = async (id) => {
  const response = await api.get(`/sessions/${id}`);
  return response.data;
};

export const acceptSession = async (id) => {
  const response = await api.put(`/sessions/${id}/accept`);
  return response.data;
};

export const declineSession = async (id, reason = "") => {
  const response = await api.put(`/sessions/${id}/decline`, { reason });
  return response.data;
};

export const completeSession = async (id) => {
  const response = await api.put(`/sessions/${id}/complete`);
  return response.data;
};

export const cancelSession = async (id, reason = "") => {
  const response = await api.put(`/sessions/${id}/cancel`, { reason });
  return response.data;
};