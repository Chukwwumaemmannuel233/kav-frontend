import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Attach token
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 👇 HANDLE EXPIRED TOKEN
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/pages/auth/login";
    }

    return Promise.reject(error);
  }
);

export default API;
