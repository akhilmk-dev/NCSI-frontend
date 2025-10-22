import api from '../utils/axiosInstance';

export const getHomePageData = async () => {
  const response = await api.get('/V1/homepage');
  return response.data.data;
}
