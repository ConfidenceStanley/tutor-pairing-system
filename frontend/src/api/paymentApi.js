import api from "./axios";

export const initializePayment = async (bookingData) => {
  const response = await api.post("/payments/initialize", bookingData);
  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await api.get(`/payments/verify/${reference}`);
  return response.data;
};

export const getMyPayments = async () => {
  const response = await api.get("/payments/my-payments");
  return response.data;
};