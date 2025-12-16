// services/newsService.js
import api from '../utils/axiosInstance';

// ===============================
// Fetch News List
// ===============================
export const getNews = async (page = 1, pagesize = 3) => {
  try {
    const response = await api.post('/V1/news/list', {
      pagesize,
      currentpage: page,
      sortorder: {
        field: 'news_date',
        direction: 'desc',
      },
      searchstring: '',
      filter: {},
    });

    // Return only the news array (or an empty array if none)
    return response.data.data?.news || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// ===============================
// Fetch News Details (Single)
// ===============================
export const getNewsDetails = async (id) => {
  try {
    const response = await api.get(`/V1/news/view/${id}`);
    return response.data.data.news;
  } catch (error) {
    console.error('Error fetching news details:', error);
    throw error;
  }
};
