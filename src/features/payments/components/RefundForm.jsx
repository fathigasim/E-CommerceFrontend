import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  refundPayment,
  selectRefundLoading,
  selectCurrentPayment,
} from '../paymentsSlice';
import { toast } from 'react-toastify';
import './RefundForm.css';

const RefundForm = ({ paymentId, onSuccess }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectRefundLoading);
  const payment = useSelector(selectCurrentPayment);

  const [refundAmount, setRefundAmount] = useState('');
  const [refundType, setRefundType] = useState('full');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (refundType === 'partial' && !refundAmount) {
      toast.error('Please enter refund amount');
      return;
    }

    const amount = refundType === 'full' ? null : parseFloat(refundAmount) * 100;

    try {
      await dispatch(refundPayment({ paymentId, amount })).unwrap();
      toast.success('Refund processed successfully');
      setRefundAmount('');
      setRefundType('full');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error || 'Refund failed');
    }
  };

  const maxRefundAmount = payment
    ? (payment.amount - payment.refundedAmount) / 100
    : 0;

  return (
    <div className="refund-form-container">
      <h3>Process Refund</h3>
      
      <form onSubmit={handleSubmit} className="refund-form">
        <div className="form-group">
          <label>
            <input
              type="radio"
              value="full"
              checked={refundType === 'full'}
              onChange={(e) => setRefundType(e.target.value)}
            />
            <span>Full Refund</span>
            {payment && (
              <span className="amount-label">
                ({new Intl.NumberFormat('en-US',{
                  style: 'currency',
                  currency: payment.currency.toUpperCase(),
                }).format(maxRefundAmount)})
              </span>
            )}
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="radio"
              value="partial"
              checked={refundType === 'partial'}
              onChange={(e) => setRefundType(e.target.value)}
            />
            <span>Partial Refund</span>
          </label>
        </div>

        {refundType === 'partial' && (
          <div className="form-group">
            <label htmlFor="refundAmount">Refund Amount</label>
            <input
              type="number"
              id="refundAmount"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max={maxRefundAmount}
              required
              className="amount-input"
            />
            <small>Maximum: ${maxRefundAmount.toFixed(2)}</small>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || maxRefundAmount <= 0}
          className="refund-button"
        >
          {loading ? 'Processing...' : 'Process Refund'}
        </button>

        {maxRefundAmount <= 0 && (
          <p className="error-message">No refundable amount available</p>
        )}
      </form>
    </div>
  );
};

export default RefundForm;