import api from "../utils/axiosInstance";

export const getLicences = async (page = 1, pagesize = 10, searchstring = "") => {
  try {
    const body = {
      pagesize,
      currentpage: page,
      searchstring,
      sortorder: {
        field: "created_at",
        direction: "asc",
      },
      filter: {
        type: "",
        classification_id: "",
        status: 1,
      },
    };

    const response = await api.post("/V1/liscences/list", body);

    return {
      licences: response.data.data?.liscences || [],
      total: response.data.data?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching licences:", error);
    return { licences: [], total: 0 };
  }
};
    