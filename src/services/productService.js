import api from "./api";

export const getProducts = async (params = {}) => {
  const response = await api.get("/view/products/customer", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/view/product/${id}`);
  return response.data;
};

export const getProductSeller = async (params = {}) => {
  const response = await api.get("/view/products/seller", { params });
  return response.data;
};

export const addProduct = async (productData) => {
  const formData = new FormData();
  for (const key in productData) {
    formData.append(key, productData[key]);
  }
  const response = await api.post("/add/product", formData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`delete/product/${id}`);
  return response.data;
};

export const editProduct = async (id, updatedData) => {
  const response = await api.put(`/edit/product/${id}`, updatedData);
  return response.data;
};


export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};


