import axiosInstance from './index';

export async function fetchDashboardStats() {
  const { data } = await axiosInstance.get('/dashboard/stats');
  return data.data;
}
