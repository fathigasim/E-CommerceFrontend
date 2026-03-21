// components/Forbidden.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';

const Forbidden = () => {
  const location = useLocation();
  const { requiredRoles, userRoles, from } = location.state || {};

  return (
    <Container className="py-5">
      <div className="text-center">
        <FaLock size={80} className="text-danger mb-4" />
        <h1 className="text-danger">403 - Access Forbidden</h1>
        <p className="lead text-muted">
          You don't have permission to access this page.
        </p>
        
        {requiredRoles && (
          <Alert variant="warning" className="mt-4 d-inline-block">
            <strong>Required roles:</strong> {requiredRoles.join(', ')}
            <br />
            <strong>Your roles:</strong> {userRoles?.length > 0 ? userRoles.join(', ') : 'None'}
          </Alert>
        )}

        <div className="mt-4">
          <Link to="/">
            <Button variant="primary" className="me-2">
              Go Home
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline-secondary">
              Login with Different Account
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Forbidden;