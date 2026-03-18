import axios from 'axios';
import { tokenService } from './tokenService';

// Debug: Log the environment variable
console.log('All env variables:', import.meta.env);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

const apiUrl = import.meta.env.VITE_API_URL;
console.log('apiUrl value:', apiUrl);

// Check if undefined
if (!apiUrl) {
  console.error('⚠️ VITE_API_URL is undefined! Check your .env file');
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  
  withCredentials: true, // ✅ CRITICAL: Sends HttpOnly cookies

});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      // const message = error.response?.data?.error || error.message;
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue requests while refreshing
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenService.getRefreshToken();
    const accessToken = tokenService.getAccessToken();
    const userId = tokenService.getUserIdFromToken(accessToken);

    if (!refreshToken || !userId) {
      isRefreshing = false;
      tokenService.clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // Call refresh token endpoint
      const response = await axios.post(
        
        `${apiUrl}/auth/refresh-token`,
        {
          accessToken,
          refreshToken,
          userId,
        }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      tokenService.setTokens(newAccessToken, newRefreshToken);
      
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      tokenService.clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default api;