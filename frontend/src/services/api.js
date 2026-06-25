import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/authSlice';

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:5000';
const BASE_URL = `${API_ORIGIN}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUploadUrl = (uploadPath) => {
  if (!uploadPath) return '';
  if (/^https?:\/\//i.test(uploadPath)) return uploadPath;
  const path = uploadPath.startsWith('/') ? uploadPath : `/${uploadPath}`;
  return `${API_ORIGIN}${path}`;
};

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_ORIGIN, BASE_URL };