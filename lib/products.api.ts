import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) => {
  const res = await axios.get(`${API}/products`, { params });
  return res.data;
};

export const getProductById = async (id: number | string) => {
  const res = await axios.get(`${API}/products/${id}`);
  return res.data;
};
