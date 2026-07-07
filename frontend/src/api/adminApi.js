import api from "./axios";

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

export const getAdminUser = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/deactivate`);
  return response.data;
};

export const activateUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/activate`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAdminSessions = async (params = {}) => {
  const response = await api.get("/admin/sessions", { params });
  return response.data;
};

export const getAdminPayments = async (params = {}) => {
  const response = await api.get("/admin/payments", { params });
  return response.data;
};