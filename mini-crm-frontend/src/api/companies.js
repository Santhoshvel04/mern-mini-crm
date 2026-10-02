import axiosInstance from './index';

export async function fetchCompanies() {
  const { data } = await axiosInstance.get('/companies');
  return data.data;
}

export async function fetchCompany(id) {
  const { data } = await axiosInstance.get(`/companies/${id}`);
  return data.data;
}

export async function createCompany(payload) {
  const { data } = await axiosInstance.post('/companies', payload);
  return data.data;
}
