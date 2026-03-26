import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { toast } from 'react-toastify';
import { Container,Navbar } from 'react-bootstrap';
import LangSelector from './LangSelector';
import { useTranslation } from 'react-i18next';
import './Navigation.css';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const {t}=useTranslation("navbar");
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <Navbar className="navbar" expand="lg">
      <Container>
      
          <Link to="/" className="nav-brand">
           {t("ECommerceApp")} 
            
          </Link>

        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <span className="nav-user">
                Welcome, {user?.firstName || user?.email}
              </span>
              {/* <Link to="/checkout" className="nav-link">
                Checkout
              </Link> */}
              <Link to="/payments" className="nav-link">
                My Payments
              </Link>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              
              <Link to="/login" className="nav-link">
                {t("Login_nav")}
              </Link>
              <Link to="/register" className="nav-button">
                {t("Register")}
              </Link>
            </>
          )}
          <LangSelector/>
        </div>
      </Container>
    </Navbar>
  );
};

export default Navigation;