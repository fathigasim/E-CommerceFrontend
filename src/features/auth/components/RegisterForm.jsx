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
import { Container,Col,Row,Form,FormControl } from 'react-bootstrap';
import './AuthForms.css';

const RegisterForm = () => {
    const [formErrors, setFormErrors] = useState({});
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // const validateForm = () => {
  //   if (!fData.email || !fData.password || !fData.firstName || !fData.lastName) {
  //     toast.error('Please fill in all fields');
  //     return false;
  //   }

  //   if (fData.password.length < 6) {
  //     toast.error('Password must be at least 6 characters');
  //     return false;
  //   }

  //   if (fData.password !== fData.confirmPassword) {
  //     toast.error('Passwords do not match');
  //     return false;
  //   }

  //   return true;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   return;
    // }
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
      // Error handled by useEffect
        console.log("Validation errors:", err);
  if (err?.message) {
      setFormErrors({ general: err.message });
      console.error('general message :', formErrors.general.message) ;
    }
    setFormErrors({
      email: err?.Email?.[0],
      password: err?.Password?.[0],
      firstName: err?.FirstName?.[0],
      lastName: err?.LastName?.[0],
      username: err?.UserName?.[0],
      confirmPassword: err?.ConfirmPassword?.[0],
    });
      console.error('Login failed:', err);
    }
  };

  return (
    <Container className="mt-5 ">
      <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
         <Col md={5} className="mt-5 mx-auto">
        <h2>Register</h2>
        <Form noValidate onSubmit={handleSubmit} className="auth-form">
          <Row className="mb-3">
            <Col>
            <Form.Group className="form-group">
              <label htmlFor="firstName">First Name</label>
              <FormControl
                type="text"
                id="firstName"
                name="firstName"
                value={fData.firstName}
                onChange={(e)=>{handleChange(e)
     if (formErrors.firstName) {
      setFormErrors(prev => ({
        ...prev,
        firstName: undefined
      }))}
                }}
                   isInvalid={!!formErrors.firstName}
                placeholder="First name"
                required
                  
             
              autoComplete="name"
              />
                <Form.Control.Feedback type="invalid">
                                    {formErrors.firstName}
                                     </Form.Control.Feedback>
            </Form.Group>
            </Col>
           <Col>
            <Form.Group className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <FormControl
                type="text"
                id="lastName"
                name="lastName"
                value={fData.lastName}
                onChange={(e)=>{handleChange(e)
                    if (formErrors.lastName) {
      setFormErrors(prev => ({
        ...prev,
        lastName: undefined
      }))}
                }}
                  isInvalid={!!formErrors.lastName}
                placeholder="Last name"
                required
                autoComplete='name'
              />
                <Form.Control.Feedback type="invalid">
                                    {formErrors.lastName}
                                     </Form.Control.Feedback>
            </Form.Group>
            </Col>
          </Row>
          <Form.Group className="form-group">
            <label htmlFor="username">Username</label>
            <FormControl
              type="text"
              id="username"
              name="username"
              value={fData.username}
              onChange={(e)=>{handleChange(e)
                  if (formErrors.username) {
      setFormErrors(prev => ({
        ...prev,
        username: undefined
      }))}
              }}
               isInvalid={!!formErrors.username}
              placeholder="Enter your username"
              
              required
              autoComplete="username"
            />
            <Form.Control.Feedback type="invalid">
                                    {formErrors.username}
                                     </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <label htmlFor="email">Email</label>
            <FormControl
              type="email"
              id="email"
              name="email"
              value={fData.email}
              onChange={(e)=>{handleChange(e)
                  if (formErrors.email) {
      setFormErrors(prev => ({
        ...prev,
        email: undefined
      }))}
              
              }}
                  isInvalid={!!formErrors.email}
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
             <div className="password-wrapper">
              <FormControl
              className='password-input-wrapper'
            
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={fData.password}
                onChange={(e) =>{ handleChange(e)

                    if (formErrors.password) {
      setFormErrors(prev => ({
        ...prev,
        password: undefined
      }))}
                }}
                 isInvalid={!!formErrors.password}
                placeholder="Enter your password"
                required
                autoComplete="password"
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
            </div>
            
          </Form.Group>

          <Form.Group className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
             <div className="password-wrapper">
            <FormControl
             className='password-input-wrapper'
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={fData.confirmPassword}
              onChange={(e)=>{handleChange(e)

     if (formErrors.confirmPassword) {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: undefined
      }))}
              }}
              isInvalid={!!formErrors.confirmPassword}
              placeholder="Confirm your password"
              required
              autoComplete="confirm-password"
              // className={!passwordMatch ? 'error' : ''}
            />
             {/* <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button> */}
              <Form.Control.Feedback type="invalid">
                                    {formErrors.confirmPassword}
                                     </Form.Control.Feedback>
           </div>
            {/* {!passwordMatch && fData.confirmPassword && (
              <small className="error-text">Passwords do not match</small>
            )} */}
              
          </Form.Group>

          <button
            type="submit"
            className="auth-button"
            disabled={loading }
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </Form>
        </Col>
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </Row>
    </Container>
  );
};

export default RegisterForm;