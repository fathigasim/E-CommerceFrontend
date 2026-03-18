import api from '../../services/api';

export const paymentsApi = {
  // Create payment intent
  createPaymentIntent: async (data) => {
    const response = await api.post('/payments/create-payment-intent', {
      amount: data.amount,
      currency: data.currency || 'usd',
      customerEmail: data.customerEmail,
    });
    return response.data;
  },

  // Get payment details
  getPayment: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Refund payment
  refundPayment: async (paymentId, amount = null) => {
    const response = await api.post(`/payments/${paymentId}/refund`, {
      amount,
    });
    return response.data;
  },
};