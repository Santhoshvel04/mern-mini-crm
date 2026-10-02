import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const TOKEN_KEY = 'miniCrmAccessToken';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLogin = String(error.config?.url || '').includes('/auth/login');
    if (status === 401 && !isLogin && !window.location.pathname.startsWith('/login')) {
      setToken(null);
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
