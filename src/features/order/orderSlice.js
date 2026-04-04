import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi } from './orderApi';

export const fetchOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async ({q,pageNumber,pageSize}, { rejectWithValue }) => {

    try {
      console.log('Fetching Orders');
      const result = await orderApi.fetchOrders({q,pageNumber,pageSize});
      console.log('Orders Data :', result);
      return result;
    } catch (error) {
   
     return rejectWithValue(error.response?.data || error.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
    async (paymentIntentId, { rejectWithValue }) => {
    try {
      const result = await orderApi.addOrder(paymentIntentId);                                                                    
      return result;                                           
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Initial state
const initialState = {
isSuccess:false,
 items:[],
 totalPages:0,
 errorMessage:null,

 error: null,
loading: false,
};                                                                                                                    

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      
    },

  },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  extraReducers: (builder) => {
    builder
      // Order                              
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        state.error = null;

      }).addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items;
        state.totalPages=action.payload.data.totalPages
        state.error=null;
        console.log('order data:', state.items);
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
        state.error = "some went wrong";
      
      })
    }
    });

    // ✅ Selectors
    export const selectOrderData = (state) => state.order.items;
    export const selectOrderTotalPages = (state) => state.order.totalPages; // The Number
    export const selectOrderLoading = (state) => state.order.loading;
    export const selectOrderError = (state) => state.order.error;
    
    
    export default orderSlice.reducer;