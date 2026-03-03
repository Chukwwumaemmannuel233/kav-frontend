import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// ================= REQUEST =================
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ================= RESPONSE =================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;

      // 🚫 DO NOTHING if already on login page
      if (currentPath.includes("/auth/login")) {
        return Promise.reject(error);
      }

      // 🚫 DO NOTHING if request is login request
      if (error.config?.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      // ✅ ONLY logout if token expired or user blocked
      if (
        status === 401 ||
        status === 403 ||
        code === "TOKEN_EXPIRED" ||
        code === "NO_TOKEN"
      ) {
        console.warn("Session expired → logging out");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
