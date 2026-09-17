import { api } from './api';
import { FilterProductParams, Product } from '../types';

export const productsService = {
  async getAll(params?: FilterProductParams): Promise<Product[]> {
    const response = await api.get<any>('/products', { params });
    const data = response.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async create(formData: FormData): Promise<Product> {
    const response = await api.post<Product>('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async update(id: string, formData: FormData): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
