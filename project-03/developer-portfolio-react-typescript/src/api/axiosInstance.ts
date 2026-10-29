import axios from 'axios';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default apiClient;
