import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  selectPaymentLoading,
  selectPaymentError,
  selectProcessingPayment,
  setProcessingPayment,
} from '../paymentsSlice';
import { toast } from 'react-toastify';
import './CheckoutForm.css';

const CheckoutForm = ({ amount, currency = 'usd', customerEmail, onSuccess }) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const loading = useSelector(selectPaymentLoading);
  const error = useSelector(selectPaymentError);
  const processingPayment = useSelector(selectProcessingPayment);

  const [message, setMessage] = useState(null);
  const [isElementsReady, setIsElementsReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check everything is ready
    if (!stripe || !elements || !isElementsReady) {
      console.log('Not ready:', { 
        stripe: !!stripe, 
        elements: !!elements, 
        isElementsReady 
      });
      return;
    }

    dispatch(setProcessingPayment(true));
    setMessage(null);

    try {
      // ✅ Step 1: Validate the payment form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setMessage(submitError.message);
        toast.error(submitError.message);
        dispatch(setProcessingPayment(false));
        return;
      }

      // ✅ Step 2: Confirm the payment (clientSecret is already in Elements)
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          receipt_email: customerEmail,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setMessage(confirmError.message);
        toast.error(confirmError.message);
      } else if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          setMessage('Payment successful!');
          toast.success('Payment successful!');
          if (onSuccess) {
            onSuccess(paymentIntent);
          }
        } else if (paymentIntent.status === 'processing') {
          setMessage('Payment is processing...');
          toast.info('Payment is processing...');
        } else if (paymentIntent.status === 'requires_payment_method') {
          setMessage('Payment failed. Please try another payment method.');
          toast.error('Payment failed. Please try another payment method.');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage(err.message || 'An error occurred');
      toast.error(err.message || 'An error occurred');
    } finally {
      dispatch(setProcessingPayment(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-details">
        <h3>Payment Details</h3>
        <div className="amount-info">
          <span>Amount:</span>
          <strong>
            {new Intl.NumberFormat('ar-SA', {
              style: 'currency',
              currency: currency.toUpperCase(),
            }).format(amount / 100)}
          </strong>
        </div>
      </div>

      {/* ✅ PaymentElement with onReady callback */}
      <PaymentElement
        onReady={() => {
          console.log('✅ PaymentElement is ready');
          setIsElementsReady(true);
        }}
        onLoadError={(err) => {
          console.error('❌ PaymentElement load error:', err);
          toast.error('Failed to load payment form');
        }}
        onChange={(event) => {
          // Optional: Track form completion
          console.log('Payment form complete:', event.complete);
        }}
      />

      {message && (
        <div className={`payment-message ${message.includes('successful') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || !isElementsReady || processingPayment || loading}
        className="pay-button"
      >
        {processingPayment || loading ? (
          <span className="button-spinner">
            <span className="spinner"></span>
            Processing...
          </span>
        ) : !isElementsReady ? (
          'Loading...'
        ) : (
          `Pay ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
          }).format(amount / 100)}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;