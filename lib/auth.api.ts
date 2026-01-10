import API from "./api";

export const signup = async (data:any) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};