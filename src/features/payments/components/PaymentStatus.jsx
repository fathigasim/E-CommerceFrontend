import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPaymentState } from '../paymentsSlice';
import './PaymentStatus.css';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    // Clean up payment state when leaving this page
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  const handleContinue = () => {
    navigate('/');
  };

  if (redirectStatus === 'succeeded') {
    return (
      <div className="payment-status success">
        <div className="status-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully.</p>
        <div className="payment-info">
          <p><strong>Payment ID:</strong> {paymentIntent}</p>
        </div>
        <button onClick={handleContinue} className="continue-button">
          Continue
        </button>
      </div>
    );
  }

  if (redirectStatus === 'processing') {
    return (
      <div className="payment-status processing">
        <div className="status-icon spinner">⏳</div>
        <h1>Payment Processing</h1>
        <p>Your payment is being processed. Please wait...</p>
      </div>
    );
  }

  return (
    <div className="payment-status error">
      <div className="status-icon">✗</div>
      <h1>Payment Failed</h1>
      <p>There was an issue processing your payment. Please try again.</p>
      <button onClick={handleContinue} className="retry-button">
        Try Again
      </button>
    </div>
  );
};

export default PaymentStatus;