import API from "./api";

export const getNewArrivals = async (limit = 8, page = 1) => {
  const res = await API.get("/products/new-arrivals", {
    params: {
      limit,
      page,
    },
  });

  return res.data;
};
