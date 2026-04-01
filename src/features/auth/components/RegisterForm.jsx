import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  register,
  selectAuthLoading,
  selectAuthError,
  selectRegisterSuccess,
  selectIsAuthenticated,
  clearError,
  clearRegisterSuccess,
} from '../authSlice';
import { toast } from 'react-toastify';
import './AuthForms.css';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const registerSuccess = useSelector(selectRegisterSuccess);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [fData, setFData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (registerSuccess) {
      toast.success('Registration successful!');
      dispatch(clearRegisterSuccess());
      
      // If auto-login is enabled, redirect to home
      if (isAuthenticated) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [registerSuccess, isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (fData.confirmPassword) {
      setPasswordMatch(fData.password === fData.confirmPassword);
    }
  }, [fData.password, fData.confirmPassword]);

  const handleChange = (e) => {
    setFData({
      ...fData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!fData.email || !fData.password || !fData.firstName || !fData.lastName) {
      toast.error('Please fill in all fields');
      return false;
    }

    if (fData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (fData.password !== fData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
 const formData = new FormData();
    formData.append("email", fData.email);
    formData.append("password", fData.password);
    formData.append("confirmPassword", fData.confirmPassword);
    formData.append("firstName", fData.firstName);
    formData.append("lastName", fData.lastName);
    formData.append("username", fData.username);
    // const { confirmPassword, ...registerData } = formData;
   // const { registerData } = formData;
    
    try {
      await dispatch(register(formData)).unwrap();
    } catch (err) {
      console.error('Registration error:', err);
      // Error handled by useEffect
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={fData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={fData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={fData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={fData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={fData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small>Minimum 6 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={fData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              autoComplete="confirm-password"
              className={!passwordMatch ? 'error' : ''}
            />
           
            {!passwordMatch && fData.confirmPassword && (
              <small className="error-text">Passwords do not match</small>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || !passwordMatch}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;