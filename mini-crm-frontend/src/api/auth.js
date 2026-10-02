import axiosInstance, { setToken } from './index';

export async function login({ email, password }) {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  const payload = data.data;
  setToken(payload.token);
  return payload;
}

export async function fetchMe() {
  const { data } = await axiosInstance.get('/auth/me');
  return data.data;
}

export function logout() {
  setToken(null);
}
