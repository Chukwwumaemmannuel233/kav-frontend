import API from "./api";

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) => {
  const res = await API.get("/products", { params });
  return res.data;
};

export const getProductById = async (id: number | string) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};
