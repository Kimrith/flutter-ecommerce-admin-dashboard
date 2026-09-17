import { api } from './api';
import { Category } from '../types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async create(formData: FormData): Promise<Category> {
    const response = await api.post<Category>('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async update(id: string, formData: FormData): Promise<Category> {
    const response = await api.patch<Category>(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
