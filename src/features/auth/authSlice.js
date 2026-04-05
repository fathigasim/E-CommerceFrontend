
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { tokenService } from '../../services/tokenService';

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
       console.error('Login error:', error.response?.data?.error  );
       if (error.response?.data?.error) {
        return rejectWithValue({message:error.response.data.error});
       }
      return rejectWithValue(error.response?.data?.errors || error.response?.data?.error);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data?.error  );
       if (error.response?.data?.error) {
        return rejectWithValue({message:error.response.data.error});
       }
      return rejectWithValue(error.response?.data?.errors || error.response?.data?.error);
    }
  }
);
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    //  Clear tokens FIRST
    tokenService.clearTokens();
    
    //  Try API call (optional - fire and forget)
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore - we're logging out anyway
      console.log('Logout API call failed (ignored):', error.message);
    }
    
    return null;
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const currentAccessToken = tokenService.getAccessToken();
      const currentRefreshToken = tokenService.getRefreshToken();
      
      // ✅ Get userId (handle token being expired)
      let userId = null;
      try {
        userId = tokenService.getUserIdFromToken(currentAccessToken);
      } catch (error) {
        const user = tokenService.getUser();
        userId = user?.id || user?.userId || user?.sub;
      }

      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Calling refresh token API...');
      const response = await authApi.refreshToken(
        currentAccessToken, 
        currentRefreshToken, 
        userId
      );
      
      console.log('Refresh token API response:', response);
      return response;
    } catch (error) {
      console.error('Refresh token thunk error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: tokenService.getUser(),
  isAuthenticated: !!tokenService.getAccessToken(),
  loading: false,
  error: null,
  registerSuccess: false,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      tokenService.setUser(action.payload);
    },
    logoutLocal: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      tokenService.clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccess = true;
        
        if (action.payload.accessToken) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          tokenService.setTokens(
            action.payload.accessToken,
            action.payload.refreshToken
          );
          tokenService.setUser(action.payload.user);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        
        tokenService.setTokens(
          action.payload.accessToken,
          action.payload.refreshToken
        );
        tokenService.setUser(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        tokenService.clearTokens();
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        tokenService.clearTokens();
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        console.log('Refresh token fulfilled with:', action.payload);
        
        // ✅ Extract tokens
        const newAccessToken = 
          action.payload.accessToken || 
          action.payload.access_token;
        
        const newRefreshToken = 
          action.payload.refreshToken || 
          action.payload.refresh_token;
        
        if (newAccessToken) {
          tokenService.setTokens(newAccessToken, newRefreshToken);
          state.isAuthenticated = true;
        }
        
        // ✅ Update user if provided
        if (action.payload.user) {
          state.user = action.payload.user;
          tokenService.setUser(action.payload.user);
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        console.error('Refresh token rejected:', action.payload);
        state.user = null;
        state.isAuthenticated = false;
        tokenService.clearTokens();
      });
  },
});

export const { clearError, clearRegisterSuccess, setUser, logoutLocal } =
  authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectUserRoles = (state) => state.auth.user?.roles;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectRegisterSuccess = (state) => state.auth.registerSuccess;

export default authSlice.reducer;