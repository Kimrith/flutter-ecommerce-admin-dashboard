import { api } from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  async register(data: { email: string; password: string; name: string; phone?: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
