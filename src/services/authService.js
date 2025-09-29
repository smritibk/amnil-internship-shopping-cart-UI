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

export const forgotPassword = async (email) => {
    // console.log(email)
  const response = await api.post("/user/forgetPassword", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post(`/user/resetPassword/${token}`, { newPassword });
  return response.data;
};

export const verifyOtp = async (email, otp)=>{
    const response = await api.post("/user/verifyOTP", { email, otp });
    return response.data;
}



