import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  login,
  logout,
  register,
} from '../authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  const handleLogin = useCallback(
    async (credentials) => {
      return dispatch(login(credentials)).unwrap();
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    return dispatch(logout()).unwrap();
  }, [dispatch]);

  const handleRegister = useCallback(
    async (userData) => {
      return dispatch(register(userData)).unwrap();
    },
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };
};