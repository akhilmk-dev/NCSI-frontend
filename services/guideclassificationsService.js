// services/classificationService.js
import api from "../utils/axiosInstance";

/**
 * Fetch guide classifications list
 * @param {number} page - Current page number
 * @param {number} pagesize - Number of items per page
 * @param {string} searchstring - Search text (optional)
 * @returns {Promise<{ classifications: Array, total: number }>}
 */
export const getGuidesClassifications = async (
  page = 1,
  pagesize = 10,
  searchstring = ""
) => {
  try {
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

    const response = await api.post("/V1/guideclassifications/list", body);
    console.log("Responseee",response)

    return {
      classifications: response.data.data?.classifications || [],
      total: response.data.data?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching classifications:", error);
    return { classifications: [], total: 0 };
  }
};
