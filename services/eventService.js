// // services/eventService.js
// import api from '../utils/axiosInstance'; // adjust path based on your folder structure

// export const getEvents = async () => {
//   const response = await api.get('/V1/events/view/2'); // your actual endpoint
//   return response.data.data;
// };

import api from '../utils/axiosInstance'; 

export const getEvents = async (page = 1, pagesize = 3) => {
  const response = await api.post('/V1/events/list', {
    pagesize,
    currentpage: page,
    sortorder: {
      field: 'from_date',
      direction: 'desc',
    },
    searchstring: '',
    filter: {},
  });

  return response.data.data?.events || [];
};

export const getEventDetails = async (id) => {
  const response = await api.get(`/V1/events/view/${id}`);
  return response.data.data;
};