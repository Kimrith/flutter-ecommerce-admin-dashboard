import { api } from './api';
import { Payment } from '../types';

export const paymentsService = {
  async getPaymentByOrder(orderId: string): Promise<Payment> {
    const response = await api.get<Payment>(`/payments/order/${orderId}`);
    return response.data;
  },

  async verifyKhqr(md5: string): Promise<any> {
    const response = await api.post('/payments/khqr/verify', { md5 });
    return response.data;
  },
};
