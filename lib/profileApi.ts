import API from "./api";

export const getProfile = async () => {
  const res = await API.get("/user/profile");
  return res.data.user;
};

export const updateProfile = async (formData: FormData) => {
  const res = await API.put("/user/profile", formData);
  return res.data.user;
};
