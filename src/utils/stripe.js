import { loadStripe } from '@stripe/stripe-js';
   const stripeKeyPub
    = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
// Initialize Stripe
export const stripePromise = loadStripe(stripeKeyPub);

export const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};