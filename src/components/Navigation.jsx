import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { toast } from 'react-toastify';
import { Container,Navbar,Nav,Button  } from 'react-bootstrap';
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


<Navbar bg="dark" variant="dark" expand="lg" className="d-flex px-3">
  <Container>

    {/* Brand */}
    <Navbar.Brand as={Link} to="/">
      {t("ECommerceApp")}
    </Navbar.Brand>

    {/* Mobile toggle */}
    <Navbar.Toggle aria-controls="main-navbar" />

    <Navbar.Collapse id="main-navbar">

      {/* Left links (optional) */}
      <Nav className="me-auto">
        {isAuthenticated && (
          <Nav.Link as={Link} to="/payments">
            My Payments
          </Nav.Link>
        )}
      </Nav>

      {/* Right side */}
    <Nav className="ms-auto align-items-center gap-3"> 
  {isAuthenticated ? (
    <>
      <span className="navbar-text me-2 text-white">
        {t("Welcome")}, {user?.firstName || user?.email}
      </span>
      <Button variant="outline-light" size="sm" onClick={handleLogout}>
        {t("Logout")}
      </Button>
    </>
  ) : (
    <>
      <Nav.Link as={Link} to="/login">{t("Login_nav")}</Nav.Link>
      <Button as={Link} to="/register" variant="primary" size="sm">
        {t("Register")}
      </Button>
    </>
  )}
  <LangSelector />
</Nav>

    </Navbar.Collapse>

  </Container>
</Navbar>
  );
};

export default Navigation;