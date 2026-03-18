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
      return rejectWithValue(error.message);
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
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      rejectWithValue(error.message);
      // Still clear local tokens even if API call fails
      return null;
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      const userId = tokenService.getUserIdFromToken(accessToken);

      if (!accessToken || !refreshToken || !userId) {
        throw new Error('Missing authentication data');
      }

      const response = await authApi.refreshToken(accessToken, refreshToken, userId);
      return response;
    } catch (error) {
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
        
        // If registration returns tokens, log user in
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
      .addCase(refreshToken.fulfilled, (state, action) => {
        tokenService.setTokens(
          action.payload.accessToken,
          action.payload.refreshToken
        );
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
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
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectRegisterSuccess = (state) => state.auth.registerSuccess;

export default authSlice.reducer;