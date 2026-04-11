import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  login,
  selectAuthLoading,
  // selectAuthError,
  selectIsAuthenticated,
  // clearError,
} from '../authSlice';
import { toast } from 'react-toastify';
import {Form, Button, Alert,Container,Col,Row} from 'react-bootstrap';
import './AuthForms.css';

const LoginForm = () => {
   const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ✅ Get return URL from location state (set by RequireAuth)
  const state = location.state;
  const returnUrl = state?.from || "/"; // Default to proudcts

  const loading = useSelector(selectAuthLoading);
  // const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
         navigate(returnUrl, { replace: true })
      // navigate('/');
    }
  }, [isAuthenticated, navigate,returnUrl]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(clearError());
  //   }
  // }, [error, dispatch]);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.email || !formData.password) {
    //   toast.error('Please fill in all fields');
    //   return;
    // }

    try {
      await dispatch(login(formData)).unwrap();
       // ✅ Validate return URL (prevent open redirect vulnerability)
      const safeRedirect = returnUrl && returnUrl.startsWith("/") 
        ? returnUrl 
        : "/";

      toast.success('Login successful!');
        navigate(safeRedirect, { replace: true });
    } catch (err) {
      // Error handled by useEffect
        console.log("Validation errors:", err);
  if (err?.message) {
      setFormErrors({ general: err.message });
      console.error('general message :', formErrors.general.message) ;
    }
    setFormErrors({
      email: err?.Email?.[0],
      password: err?.Password?.[0],
      
    });
      console.error('Login failed:', err);
    }
  };

  return (
    <Container>
      
       
      <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Col md={5} >
        {formErrors.general && <Alert variant="danger">
        {formErrors.general}</Alert>}
        <h2>Login</h2>
        <Form noValidate onSubmit={handleSubmit} className="auth-form">
          <Form.Group className="form-group">
            <label htmlFor="email">Email</label>
            <Form.Control
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="w-100 rounded-3 py-2"
              onChange={(e)=>{handleChange(e)
             
         if (formErrors.email) {
      setFormErrors(prev => ({
        ...prev,
        email: undefined
      }))}
          }}
          //  className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
           isInvalid={!!formErrors.email}
          //  disabled={loading}
              
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
            <Form.Control.Feedback type="invalid">
                      {formErrors.email}
                       </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group">
            <label htmlFor="password">Password</label>
          
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) =>{ handleChange(e)
                  if (formErrors.password) {
      setFormErrors(prev => ({
        ...prev,
        password: undefined
      }))}
          }}
          //  className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
           isInvalid={!!formErrors.password}
          //  disabled={loading}
              
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              />
              {/* <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button> */}
                  <Form.Control.Feedback type="invalid">
                      {formErrors.password}
                       </Form.Control.Feedback>
       
          </Form.Group>

          <Button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
           <p>
            Forgot password? <Link to="/foregot-password">Reset here</Link>
          </p>
        </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;