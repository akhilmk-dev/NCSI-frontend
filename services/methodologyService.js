// services/methodologyService.js
import api from "../utils/axiosInstance";

export const getMethodologies = async (page = 1, pagesize = 10, searchstring = "") => {
  const body = {
    pagesize,
    currentpage: page,
    searchstring,
    sortorder: {
      field: "created_at",
      direction: "asc", 
    },
    filter: {},
  };

  const response = await api.post("/V1/methodologies/list", body);

  return {
    methodologies: response.data.data?.methodolgies || [], 
    total: response.data.data?.total || 0,
  };
};
