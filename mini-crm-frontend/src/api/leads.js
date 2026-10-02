import axiosInstance from './index';

export async function fetchLeads({ page = 1, limit = 10, search = '', status = '' } = {}) {
  const { data } = await axiosInstance.get('/leads', {
    params: { page, limit, search: search || undefined, status: status || undefined },
  });
  return data;
}

export async function fetchLead(id) {
  const { data } = await axiosInstance.get(`/leads/${id}`);
  return data.data;
}

export async function createLead(payload) {
  const { data } = await axiosInstance.post('/leads', payload);
  return data.data;
}

export async function updateLead(id, payload) {
  const { data } = await axiosInstance.put(`/leads/${id}`, payload);
  return data.data;
}

export async function deleteLead(id) {
  const { data } = await axiosInstance.delete(`/leads/${id}`);
  return data.data;
}
