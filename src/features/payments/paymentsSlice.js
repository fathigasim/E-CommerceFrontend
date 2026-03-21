import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentsApi } from './paymentsApi';

// ✅ Async thunks (unchanged)
export const getPayments = createAsyncThunk(
  'payments/getPayments',
  async ({ pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      console.log('fetching payments');
      const result = await paymentsApi.fetchPayments({ pageNumber, pageSize });
      console.log("FULL RESULT:", result);
      console.log("RESULT.DATA:", result.data);
      return result.data;
    } catch (error) {
      console.error('Payment fetching failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

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
  paymentIntentId: null,
  pageNumber: 1,        // ✅ Added missing field
  pageSize: 3,
  totalPages: 1,        // ✅ Added missing field
  totalCount: 0,        // ✅ Added missing field
  payments: [],         // This is an ARRAY
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
    resetPaymentState: () => {
      console.log('Resetting payment state');
      return initialState;
    },
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
        state.paymentIntentId = action.payload.paymentIntentId || action.payload.id;
        state.paymentIntent = action.payload;
        console.log('Client secret saved:', state.clientSecret);
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Payment intent failed:', action.payload);
      })

      // Fetch Single Payment
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        
        // ✅ FIX: Update payment in the array, not as object property
        if (action.payload.id) {
          const index = state.payments.findIndex(p => p.id === action.payload.id);
          if (index !== -1) {
            // Update existing payment in array
            state.payments[index] = action.payload;
          } else {
            // Add to array if not exists
            state.payments.push(action.payload);
          }
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
        
        // ✅ Update current payment
        if (state.currentPayment) {
          state.currentPayment = {
            ...state.currentPayment,
            ...action.payload,
            refundedAmount: action.payload.refundedAmount || state.currentPayment.refundedAmount
          };
        }
        
        // ✅ FIX: Update in payments array
        if (action.payload.id) {
          const index = state.payments.findIndex(p => p.id === action.payload.id);
          if (index !== -1) {
            state.payments[index] = {
              ...state.payments[index],
              ...action.payload
            };
          }
        }
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.refundLoading = false;
        state.refundError = action.payload;
      })

      // Get All Payments
      .addCase(getPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.items || [];
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        console.log('Payments data:', state.payments); // ✅ Fixed: was state.items
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
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
export const selectPaymentData = (state) => state.payments.payments;
export const selectPaymentTotalPages = (state) => state.payments.totalPages;
export const selectPaymentPageSize = (state) => state.payments.pageSize;
export const selectClientSecret = (state) => state.payments.clientSecret;
export const selectPaymentIntentId = (state) => state.payments.paymentIntentId;
export const selectPaymentIntent = (state) => state.payments.paymentIntent;
export const selectCurrentPayment = (state) => state.payments.currentPayment;
export const selectProcessingPayment = (state) => state.payments.processingPayment;
export const selectRefundLoading = (state) => state.payments.refundLoading;
export const selectRefundError = (state) => state.payments.refundError;

// ✅ FIX: Find payment by id in array
export const selectPaymentById = (id) => (state) => 
  state.payments.payments.find(p => p.id === id);

export default paymentsSlice.reducer;