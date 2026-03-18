import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../../utils/stripe';
import CheckoutForm from './CheckoutForm';
import { 
  selectBasketTotalCount, 
  selectBasketItemCount,
  selectBasketData,
  selectBasketLoading,
  fetchBasket  // ✅ Import fetchBasket
} from '../../basket/basketSlice';
import { createOrder } from '../../order/orderSlice';
import { selectUser } from '../../auth/authSlice';
import {
  createPaymentIntent,
  selectClientSecret,
  selectPaymentLoading,
  selectPaymentError,
  resetPaymentState,
} from '../paymentsSlice';
import './PaymentWrapper.css';
import { toast } from 'react-toastify';

const PaymentWrapper = ({ 
  currency = 'usd', 
  onSuccess 
}) => {
  const dispatch = useDispatch();
  
  // ✅ Selectors
  const user = useSelector(selectUser);
  const basketTotal = useSelector(selectBasketTotalCount); // This is the dollar amount
  const basketItemCount = useSelector(selectBasketItemCount);
  const basketItems = useSelector(selectBasketData);
  const basketLoading = useSelector(selectBasketLoading);
  
  const clientSecret = useSelector(selectClientSecret);
  const paymentLoading = useSelector(selectPaymentLoading);
  const error = useSelector(selectPaymentError);

  console.log('=== PaymentWrapper Debug ===');
  console.log('User:', user);
  console.log('Basket Total (dollars):', basketTotal);
  console.log('Basket Item Count:', basketItemCount);
  console.log('Basket Items:', basketItems);
  console.log('Basket Loading:', basketLoading);
  console.log('Client Secret:', clientSecret);
  console.log('Payment Loading:', paymentLoading);
  console.log('Error:', error);

  // ✅ Convert dollars to cents for Stripe
  const amountInCents = useMemo(() => {
    // basketTotal appears to be in dollars based on your state structure
    // Stripe requires amount in cents (smallest currency unit)
    return Math.round(basketTotal * 100);
  }, [basketTotal]);

  console.log('Amount in cents for Stripe:', amountInCents);

  // ✅ Load basket on component mount
  useEffect(() => {
    // Fetch basket if items are empty
    if (basketItems.length === 0 && !basketLoading) {
      console.log('🛒 Fetching basket...');
      dispatch(fetchBasket());
    }
  }, [dispatch, basketItems.length, basketLoading]);

  // ✅ Create payment intent when basket is ready
  useEffect(() => {
    // Don't proceed if basket is still loading
    if (basketLoading) {
      console.log('⏳ Waiting for basket to load...');
      return;
    }

    // Validate basket has items
    if (!basketItems || basketItems.length === 0) {
      console.log('⚠️ No items in basket');
      return;
    }

    // Validate amount
    if (amountInCents <= 0) {
      console.log('⚠️ Invalid payment amount:', amountInCents);
      toast.error('Invalid payment amount');
      return;
    }

    // Validate user
    if (!user?.email) {
      console.log('No user email');
      toast.error('Please log in to continue');
      return;
    }

    // Create payment intent only once
    if (!clientSecret && !paymentLoading) {
      console.log('Creating payment intent with amount:', amountInCents);
      dispatch(createPaymentIntent({ 
        amount: amountInCents,
        currency, 
        customerEmail: user.email,
      }));
    }
  }, [
    dispatch, 
    amountInCents, 
    currency, 
    user?.email, 
    clientSecret, 
    paymentLoading, 
    basketItems, 
    basketLoading
  ]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up payment state');
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  // ✅ Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // ✅ Memoize Stripe options
  const options = useMemo(() => {
    if (!clientSecret) return null;
    
    return {
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0570de',
          colorBackground: '#ffffff',
          colorText: '#30313d',
          colorDanger: '#df1b41',
          fontFamily: 'Ideal Sans, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '4px',
        },
      },
    };
  }, [clientSecret]);

  // ✅ Payment success handler
 const handlePaymentSuccess = async (paymentIntent) => {
  console.log('Payment succeeded:', paymentIntent);
  toast.success('Payment successful!');

  try {
    // Pass paymentIntent.id to createOrder
    const result = await dispatch(createOrder(paymentIntent.id)).unwrap();
    console.log('Order created:', result);
    toast.success('Order created successfully!');
  } catch (error) {
    console.error('Order creation failed:', error);
    toast.error('Failed to create order');
  }
};

  // ✅ Retry handler
  const handleRetry = () => {
    console.log('Retrying payment intent creation...');
    dispatch(resetPaymentState());
    
    if (amountInCents > 0 && user?.email) {
      dispatch(createPaymentIntent({ 
        amount: amountInCents, 
        currency, 
        customerEmail: user.email 
      }));
    }
  };

  // ✅ Basket loading state
  if (basketLoading) {
    return (
      <div className="payment-loading">
        <div className="spinner-large"></div>
        <p>Loading basket...</p>
      </div>
    );
  }

  // ✅ No items in basket
  if (!basketItems || basketItems.length === 0) {
    return (
      <div className="payment-error">
        <p>Your basket is empty. Add items before checkout.</p>
        <button onClick={() => window.location.href = '/products'}>
          Browse Products
        </button>
      </div>
    );
  }

  //  Invalid amount
  if (amountInCents <= 0) {
    return (
      <div className="payment-error">
        <p>Invalid payment amount. Please check your basket.</p>
      </div>
    );
  }

  //  Payment loading state
  if (paymentLoading || !clientSecret) {
    return (
      <div className="payment-loading">
        <div className="spinner-large"></div>
        <p>Preparing payment form...</p>
        <p className="text-muted">Amount: ${basketTotal.toFixed(2)}</p>
      </div>
    );
  }

  //  Error state
  if (error) {
    return (
      <div className="payment-error">
        <p className="error-message">{error}</p>
        <button 
          onClick={handleRetry}
          className="retry-button"
        >
          Retry Payment
        </button>
      </div>
    );
  }

  //  No options available
  if (!options) {
    return (
      <div className="payment-loading">
        <div className="spinner-large"></div>
        <p>Initializing payment...</p>
      </div>
    );
  }

  // Render payment form
  return (
    <div className="payment-wrapper">
      <div className="payment-summary">
        <h3>Order Summary</h3>
        <ul className="order-items">
          {basketItems.map((item) => (
            <li key={item.productId} className="order-item">
             <span>{item.productName} : </span> <span>{item.name} x {item.quantity}</span>
             <span>Total</span> <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p>Items: {basketItemCount}</p>
        <p className="total-amount">Total: ${basketTotal.toFixed(2)}</p>
      </div>
      
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          amount={amountInCents}
          currency={currency}
          customerEmail={user?.email}
          onSuccess={handlePaymentSuccess}
        />
      </Elements>
    </div>
  );
};

export default PaymentWrapper;