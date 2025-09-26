import api from "./api.js";

export const register = async (userData) => {
  const response = await api.post("/user/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/user/login", credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/user/logout");
  return response.data;
};


