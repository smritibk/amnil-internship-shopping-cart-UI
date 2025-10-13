import api from "./api";

export const getProductByCategory = async () => {
  const response = await api.get("/report/productByCategory");
  return response.data;
};

export const dailyRevenueExcel = async (params = {}) => {
  const response = await api.get("/report/dailyRevenueExcel", { params });
  return response.data;
};

export const dailyRevenuePDF = async (params = {}) => {
  const response = await api.get("/report/dailyRevenuePDF", { params });
  return response.data;
};

