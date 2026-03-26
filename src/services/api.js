import axios from 'axios';
import { tokenService } from './tokenService';
import i18n from "../i18n";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
  
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let isRedirecting = false;
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
      // ✅ Always set the language, regardless of token
    config.headers["Accept-Language"] = i18n.language;
    return config;

  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    isRedirecting = false; // Reset on success
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    //  Already redirecting? Stop processing
    if (isRedirecting) {
      return new Promise(() => {});
    }

    //  Skip interceptor for logout requests
    if (originalRequest?.url?.includes('/auth/logout') || 
        originalRequest?.url?.includes('/logout')) {
      console.log('Logout request - skipping interceptor');
      return Promise.reject(error);
    }

    // ✅ Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.log(" 403 Forbidden");
      isRedirecting = true;
      window.location.replace("/forbidden");
      return new Promise(() => {});
    }

    // ✅ Handle 500 Server Error
    if (error.response?.status === 500||!error.response) {
      console.log(" 500 Server Error");
      isRedirecting = true;
      window.location.replace("/serverError");
      return new Promise(() => {});
    }

    // ✅ Handle Network Error (no response)
    if (!error.response) {
      console.log(" Network Error");
      // Don't redirect for network errors - let the component handle it
      return Promise.reject(error);
    }

    // ✅ IMPORTANT: Only handle 401 errors for token refresh!
    if (error.response?.status !== 401) {
      // Not a 401 - just reject (400, 404, 422, etc.)
      return Promise.reject(error);
    }

    // ============ 401 HANDLING BELOW ============
    console.log(' 401 Unauthorized - attempting refresh...');

    // Already retried?
    if (originalRequest._retry) {
      console.error('Request already retried, clearing tokens');
      isRedirecting = true;
      tokenService.clearTokens();
      window.location.replace('/login');
      return new Promise(() => {});
    }

    // Don't retry refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh-token')) {
      console.error('Refresh endpoint failed');
      isRedirecting = true;
      tokenService.clearTokens();
      window.location.replace('/login');
      return new Promise(() => {});
    }

    // Queue if already refreshing
    if (isRefreshing) {
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

    const currentAccessToken = tokenService.getAccessToken();
    const currentRefreshToken = tokenService.getRefreshToken();

    // Get userId
    let userId = tokenService.getUserIdFromToken(currentAccessToken);
    if (!userId) {
      const user = tokenService.getUser();
      userId = user?.id || user?.userId;
    }

    console.log(' Refresh attempt:', {
      hasAccessToken: !!currentAccessToken,
      hasRefreshToken: !!currentRefreshToken,
      userId: userId
    });

    // No refresh token? Can't refresh
    if (!currentRefreshToken) {
      console.error('No refresh token available');
      isRefreshing = false;
      isRedirecting = true;
      tokenService.clearTokens();
      window.location.replace('/login');
      return new Promise(() => {});
    }

    try {
      console.log(' Calling refresh endpoint...');
      
      const refreshResponse = await axios.post(
        `${apiUrl}/auth/refresh-token`,
        {
          accessToken: currentAccessToken,
          refreshToken: currentRefreshToken,
          userId: userId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      console.log('Refresh successful');

      const newAccessToken = 
        refreshResponse.data?.accessToken || 
        refreshResponse.data?.access_token;
      
      const newRefreshToken = 
        refreshResponse.data?.refreshToken || 
        refreshResponse.data?.refresh_token ||
        currentRefreshToken;

      if (!newAccessToken) {
        throw new Error('No access token in response');
      }

      tokenService.setTokens(newAccessToken, newRefreshToken);

      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      isRefreshing = false;

      return api(originalRequest);

    } catch (refreshError) {
      console.error('Refresh failed:', refreshError.response?.data || refreshError.message);
      
      processQueue(refreshError, null);
      isRefreshing = false;
      isRedirecting = true;
      tokenService.clearTokens();
      window.location.replace('/login');
      
      return new Promise(() => {});
    }
  }
);

export default api;