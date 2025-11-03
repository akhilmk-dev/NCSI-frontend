// services/glossaryService.js
import api from "../utils/axiosInstance";

export const getGlossary = async (page = 1, pagesize = 10, searchstring = "") => {
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

  const response = await api.post("/V1/statistics/list", body);
  return {
   statistics: response.data.data?.statistics || [],
    total: response.data.data?.total || 0,
  };
};
