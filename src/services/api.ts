import axios from 'axios';

// Base API URL pointing to the NestJS server (Port 3300 as configured in backend .env)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3300/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Automatically unwrap NestJS TransformResponseInterceptor ({ success, data }) and handle 401
api.interceptors.response.use(
  (response) => {
    // If backend response is wrapped in { success: true, statusCode: 200, data: ... }
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const refreshData = refreshRes.data?.data || refreshRes.data;
        const { accessToken, refreshToken: newRefreshToken } = refreshData;

        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
