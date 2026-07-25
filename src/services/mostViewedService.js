import axiosInstance from '../api/axiosInstance';

export const mostViewedService = {
  getMostViewed: async () => {
    const { data } = await axiosInstance.get('/admin/analytics/most-viewed');
    return data;
  },
};

export default mostViewedService;
