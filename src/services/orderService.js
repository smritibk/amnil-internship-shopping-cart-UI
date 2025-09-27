import api from "./api";

export const placeOrder = async (orderData) => {
  const response = await api.post("/order/place", orderData);
  return response.data;
}

export const getOrderById = async (id) => {
  const response = await api.get(`/order/view/${id}`);
  return response.data;
}