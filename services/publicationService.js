import api from '../utils/axiosInstance'; 
import axios from 'axios';

// export const getPublications = async (payload) => {
//   const response = await api.post('/V1/publications/list', payload);
//   return response.data.data;
// };

export const getPublications = async (payload = {}) => {
  const defaultPayload = {
    pagesize: 6,
    currentpage: 1,
    searchstring: '',
    is_frontend:true,
    sortorder: {
      field: 'created_at',
      direction: 'desc',
    },
    filter: {
      type: '',
      classification_id: '',
      status:1,
    },
  };

  const response = await api.post('/V1/publications/list', {
    ...defaultPayload,
    ...payload,
  });

  return response.data.data;
};


export const getMostViewed = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await axios.get(`${baseUrl}V1/publications/top`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching most viewed publications:', error);
    return [];
  }
};