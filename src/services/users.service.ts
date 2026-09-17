import { api } from './api';
import { User } from '../types';

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },
};
