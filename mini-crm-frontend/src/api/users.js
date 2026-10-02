import axiosInstance from './index';

export async function fetchUsers() {
  const { data } = await axiosInstance.get('/users');
  return data.data;
}
