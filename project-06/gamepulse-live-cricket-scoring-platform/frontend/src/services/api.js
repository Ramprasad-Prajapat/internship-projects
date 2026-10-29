import axios from 'axios';

let baseUrl = '/api';
try {
  baseUrl = (new Function('return import.meta.env.VITE_API_BASE_URL'))() || '/api';
} catch (_e) {
  baseUrl = '/api';
}
export const API_BASE_URL = baseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gamepulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Search API with pagination and optional filter.
 * @param {string} query Search query string
 * @param {string} filter Optional filter (live, upcoming, completed)
 * @param {number} page Zero‑based page index
 * @param {number} size Page size
 */
export const search = (query, filter = '', page = 0, size = 20) => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (filter) params.append('filter', filter);
  params.append('page', page);
  params.append('size', size);
  return api.get(`/search?${params.toString()}`);
};

export default api;
