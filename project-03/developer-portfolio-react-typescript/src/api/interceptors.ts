import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken, getRefreshToken, refreshAccessToken } from '@/lib/tokenManager';
import { apiClient } from './axiosInstance';

export const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const responseInterceptor = async (response: AxiosResponse) => {
  return response;
};

export const errorInterceptor = async (error: any) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest?._retry) {
    originalRequest._retry = true;
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const newToken = await refreshAccessToken(refreshToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
  return Promise.reject(error);
};
