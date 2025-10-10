import api from "./api";

export const placeOrder = async (orderData) => {
  const response = await api.post("/order/place", orderData);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/order/view/${id}`);
  return response.data;
};

export const mostPlacedProducts = async () => {
  const response = await api.get("/order/summary");
  return response.data;
};

export const getTotalRevenueByDate = async (startDate, endDate) => {
  const response = await api.get("/order/totalRevenueByDate", {
    params: { startDate, endDate },
  });
  console.log("Revenue by date response:", response.data);
  return response.data;
};

export const getRevenueByProduct = async () => {
  const response = await api.get("/order/totalSales");
  return response.data;
};

export const dailyRevenueByDate = async (params = {}) => {
  const response = await api.get("/order/dailyRevenue", {params});
  return response.data;
};
