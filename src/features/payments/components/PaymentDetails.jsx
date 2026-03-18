import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPayment,
  selectCurrentPayment,
  selectPaymentLoading,
} from '../paymentsSlice';
import './PaymentDetails.css';

const PaymentDetails = ({ paymentId }) => {
  const dispatch = useDispatch();
  const payment = useSelector(selectCurrentPayment);
  const loading = useSelector(selectPaymentLoading);

  useEffect(() => {
    if (paymentId) {
      dispatch(fetchPayment(paymentId));
    }
  }, [dispatch, paymentId]);

  if (loading) {
    return <div className="loading">Loading payment details...</div>;
  }

  if (!payment) {
    return <div className="error">Payment not found</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      succeeded: 'status-success',
      processing: 'status-warning',
      requires_payment_method: 'status-pending',
      requires_confirmation: 'status-pending',
      requires_action: 'status-warning',
      canceled: 'status-error',
      failed: 'status-error',
    };

    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status.replace(/_/g, ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="payment-details">
      <h2>Payment Details</h2>
      
      <div className="detail-group">
        <div className="detail-row">
          <span className="label">Payment ID:</span>
          <span className="value">{payment.id}</span>
        </div>

        <div className="detail-row">
          <span className="label">Stripe Payment ID:</span>
          <span className="value">{payment.stripePaymentIntentId}</span>
        </div>

        <div className="detail-row">
          <span className="label">Status:</span>
          <span className="value">{getStatusBadge(payment.status)}</span>
        </div>

        <div className="detail-row">
          <span className="label">Amount:</span>
          <span className="value amount">
            {formatAmount(payment.amount, payment.currency)}
          </span>
        </div>

        <div className="detail-row">
          <span className="label">Customer Email:</span>
          <span className="value">{payment.customerEmail}</span>
        </div>

        <div className="detail-row">
          <span className="label">Created:</span>
          <span className="value">{formatDate(payment.createdAt)}</span>
        </div>

        {payment.updatedAt && (
          <div className="detail-row">
            <span className="label">Last Updated:</span>
            <span className="value">{formatDate(payment.updatedAt)}</span>
          </div>
        )}

        {payment.refundedAmount > 0 && (
          <div className="detail-row highlight">
            <span className="label">Refunded Amount:</span>
            <span className="value">
              {formatAmount(payment.refundedAmount, payment.currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;