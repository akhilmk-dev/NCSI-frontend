// src/services/searchService.js
import api from "../utils/axiosInstance";

/**
 * Fetch search results from NCSI API
 * @param {Object} params
 * @param {string} params.q - search query
 * @param {Array<string>} [params.modules=[]] - selected modules (e.g. ['events','news'])
 * @param {string} [params.sort='date'] - sort field
 * @param {string} [params.dir='asc'] - sort direction
 * @param {number} [params.currentpage=1] - pagination page (NOTE: backend expects `currentpage`)
 */
export const getNcsiSearchResults = async ({
  q,
  modules = [],
  sort = "date",
  dir = "asc",
  currentpage = 1,
}) => {
  if (!q || q.trim().length < 3) {
    throw new Error("Minimum 3 letters required");
  }

  try {
    const params = {
      q,
      sort,
      dir,
      currentpage, // ✅ matches backend
      // Only send modules param if there is at least one
      ...(modules && modules.length > 0 ? { modules } : {}),
    };

    const response = await api.get("/V1/search", { params });

    const data = response.data?.data || {};
    const pagination = data.pagination || {};

    return {
      items: data.items || [],
      baseUrls: data.base_urls || {}, // events / methodologies / publications
      pagination: {
        currentPage: pagination.currentpage || 1,
        pageSize: pagination.pagesize || 10,
        total: pagination.total || 0,
        totalPages: pagination.total_pages || 1,
      },
      message: response.data?.message || "",
    };
  } catch (error) {
    console.error("Error fetching NCSI search results:", error);
    throw error;
  }
};
