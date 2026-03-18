import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentsApi } from './paymentsApi';

// ✅ Async thunks
export const createPaymentIntent = createAsyncThunk(
  'payments/createPaymentIntent',
  async (paymentData, { rejectWithValue }) => {
    try {
      console.log('Creating payment intent:', paymentData);
      const result = await paymentsApi.createPaymentIntent(paymentData);
      console.log('Payment intent created:', result);
      return result;
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPayment = createAsyncThunk(
  'payments/fetchPayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      return await paymentsApi.getPayment(paymentId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async ({ paymentId, amount, reason }, { rejectWithValue }) => {
    try {
      return await paymentsApi.refundPayment(paymentId, amount, reason);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Initial state
const initialState = {
  currentPayment: null,
  clientSecret: null,
  paymentIntent: null,
  paymentIntentId: null, //  Added
  payments: {},
  loading: false,
  error: null,
  refundLoading: false,
  refundError: null,
  processingPayment: false,
};

// ✅ Slice
const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.refundError = null;
    },
    setProcessingPayment: (state, action) => {
      state.processingPayment = action.payload;
    },
    resetPaymentState: (state) => {
      console.log('Resetting payment state');
      return initialState;
    },
    // ✅ Add this for manual error clearing
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.paymentIntentId = action.payload.paymentIntentId || action.payload.id; //  Handle both
        state.paymentIntent = action.payload;
        console.log('Client secret saved:', state.clientSecret);
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Payment intent failed:', action.payload);
      })

      // Fetch Payment
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        if (action.payload.id) {
          state.payments[action.payload.id] = action.payload;
        }
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Refund Payment
      .addCase(refundPayment.pending, (state) => {
        state.refundLoading = true;
        state.refundError = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.refundLoading = false;
        // ✅ Update current payment with refund data
        if (state.currentPayment) {
          state.currentPayment = { 
            ...state.currentPayment, 
            ...action.payload,
            refundedAmount: action.payload.refundedAmount || state.currentPayment.refundedAmount
          };
        }
        // ✅ Update in payments cache
        if (action.payload.id && state.payments[action.payload.id]) {
          state.payments[action.payload.id] = {
            ...state.payments[action.payload.id],
            ...action.payload
          };
        }
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.refundLoading = false;
        state.refundError = action.payload;
      });
  },
});

export const { 
  clearError, 
  setProcessingPayment, 
  resetPaymentState,
  clearPaymentError 
} = paymentsSlice.actions;

// ✅ Selectors
export const selectPaymentLoading = (state) => state.payments.loading;
export const selectPaymentError = (state) => state.payments.error;
export const selectClientSecret = (state) => state.payments.clientSecret;
export const selectPaymentIntentId = (state) => state.payments.paymentIntentId;
export const selectPaymentIntent = (state) => state.payments.paymentIntent;
export const selectCurrentPayment = (state) => state.payments.currentPayment;
export const selectProcessingPayment = (state) => state.payments.processingPayment;
export const selectRefundLoading = (state) => state.payments.refundLoading;
export const selectRefundError = (state) => state.payments.refundError;
export const selectPaymentById = (id) => (state) => state.payments.payments[id];

export default paymentsSlice.reducer;