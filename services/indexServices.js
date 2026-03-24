import api from '../utils/axiosInstance';

export const getHomePageData = async () => {
  const response = await api.get('/V1/homepage');
  return response.data.data;
}

export const getPortalLinks = async () => {
  const response = await api.post('/V1/portallinks/list', {});
  return response.data.data.portallinks;
}
