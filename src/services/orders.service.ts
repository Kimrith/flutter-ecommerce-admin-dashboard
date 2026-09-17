import { api } from './api';
import { Order, OrderStatus } from '../types';

export const ordersService = {
  async getAllAdmin(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders/admin/all');
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};
