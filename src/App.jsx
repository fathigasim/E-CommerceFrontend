import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './app/store';
import { selectIsAuthenticated } from './features/auth/authSlice';

// Auth Components
import LoginForm from './features/auth/components/LoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import PrivateRoute from './features/auth/components/PrivateRoute';

// Payment Components
import PaymentWrapper from './features/payments/components/PaymentWrapper';
import PaymentStatus from './features/payments/components/PaymentStatus';
import PaymentDetails from './features/payments/components/PaymentDetails';
import RefundForm from './features/payments/components/RefundForm';
import Payments from './features/payments/components/Payments'
// Common Components
import Navigation from './components/Navigation';
import Orders from './features/order/components/Orders';
import OrdersCharts from './features/visualreports/OrdersCharts';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from './features/product/components/Products';
import ProductList from './features/product/components/ProductList';
import ProductEdit from './features/product/components/ProductEdit';
import Basket from './features/basket/components/Basket';
import ServerError from './components/ServerError'
import { ErrorBoundary } from 'react-error-boundary';
import ProductManagement from './features/product/components/ProductManagement';
import Forebidden from './components/Forebidden';
import ResetPassword from './features/userManagement/components/ResetPassword';
import ForegotPassword from './features/userManagement/components/ForgotPassword';
import Category from './features/category/Category';
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Payment form error:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
// App Routes Component
const AppRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      <Navigation />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />}
        />
  <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
  <Route
          path="/addCategory"
          element={<Category />}
        />
         <Route
          path="/foregot-password"
          element={<ForegotPassword />}
        />
         <Route
          path="/products"
          element={ <Products />}
        />
        
          <Route
          path="/productList"
          element={ <ProductList />}
        />
 <Route
          path="/AddProduct"
          element={ <ProductManagement />}
        />

        <Route
          path="/EditProduct/:Id"
          element={ <ProductEdit />}
        />
        
         <Route
          path="/basket"
          element={ <Basket />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <RegisterForm />}
        />
         <Route
          path="/serverError"
          element={<ServerError />}
        />
        
        <Route path="/forbidden" element={<Forebidden/>} /> 
        {/* Protected Routes */}
        <Route
          path="/"
          element={
        
              <Products />
      
          }
        />
         <Route
          path="/orders"
          element={
           
              <Orders />
         
          }
        />

        <Route
          path="/orders/charts"
          element={
           
              <OrdersCharts />
         
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute allowedRoles={['User', 'Admin']}>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
          <Route allowedRoles={["Admin,User"]}
          path="/payments"
          element={
            <PrivateRoute>
              <Payments />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <PrivateRoute>
              <PaymentStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment/:paymentId"
          element={
            <PrivateRoute>
              <PaymentDetailsPage />
            </PrivateRoute>
          }
        />
        <Route 
          path="/refund/:paymentId"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <RefundPage />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// Page Components
const HomePage = () => {
  const user = useSelector(selectIsAuthenticated);
  
  return (
    <div className="page">
      <div className="page-content">
        <h1>Welcome to Payment App{user}</h1>
        <p>Your secure payment processing solution</p>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
 // const user = useSelector((state) => state.auth.user);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
  };

  return (
    <div className="page">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
      <PaymentWrapper
        // amount={5000} // $50.00 in cents
        // currency="sar"
        // customerEmail={user?.email || 'customer@example.com'}
        onSuccess={handlePaymentSuccess}
      />
      </ErrorBoundary>
    </div>
  );
};

const PaymentDetailsPage = () => {
  const paymentId = window.location.pathname.split('/').pop();

  return (
    <div className="page">
      <PaymentDetails paymentId={paymentId} />
    </div>
  );
};

const RefundPage = () => {
  const paymentId = window.location.pathname.split('/').pop();

  return (
    <div className="page">
      <PaymentDetails paymentId={paymentId}/>
      <RefundForm paymentId={paymentId}/>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;