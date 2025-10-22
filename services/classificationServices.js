import api from '../utils/axiosInstance'; 

export const getClassifications = async () => {
  const response = await api.post('/V1/classifications/list', {
    pagesize: 100,
    currentpage: 1,
    sortorder: {
      field: 'name',
      direction: 'asc',
    },
    searchstring: '',
    filter: {},
  });

  return response.data.data;
};