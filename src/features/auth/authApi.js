import api from '../../services/api';

export const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData,{headers :{ 'Content-Type':'multipart/form-data'}});
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Refresh token
  refreshToken: async (accessToken, refreshToken, userId) => {
    const response = await api.post('/auth/refresh-token', {
      accessToken,
      refreshToken,
      userId,
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};