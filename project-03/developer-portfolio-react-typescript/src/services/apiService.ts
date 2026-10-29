import { apiClient } from '@/api/axiosInstance';
import type { ApiResponse, PaginatedResponse, SortDirection } from '@/types/api';
import type { AxiosRequestConfig } from 'axios';

export interface QueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: SortDirection;
  search?: string;
  [key: string]: unknown;
}

/**
 * Generic CRUD ApiService class for Spring Boot backend resources.
 */
export class ApiService<T = unknown> {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(params?: QueryParams, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<PaginatedResponse<T>>(this.endpoint, {
      params,
      ...config,
    });
    return response.data;
  }

  async getById(id: string | number, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(`${this.endpoint}/${id}`, config);
    return response.data;
  }

  async create(data: Partial<T>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(this.endpoint, data, config);
    return response.data;
  }

  async update(id: string | number, data: Partial<T>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(`${this.endpoint}/${id}`, data, config);
    return response.data;
  }

  async delete(id: string | number, config?: AxiosRequestConfig): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${id}`, config);
    return response.data;
  }

  async upload(file: File, additionalData?: Record<string, any>): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }
    const response = await apiClient.post<ApiResponse<{ url: string }>>(`${this.endpoint}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

export const projectService = new ApiService('/api/v1/projects');
export const experienceService = new ApiService('/api/v1/experiences');
export const educationService = new ApiService('/api/v1/education');
export const skillService = new ApiService('/api/v1/skills');
export const certificationService = new ApiService('/api/v1/certifications');
export const contactService = new ApiService('/api/v1/contact');
export const analyticsService = new ApiService('/api/v1/analytics');
