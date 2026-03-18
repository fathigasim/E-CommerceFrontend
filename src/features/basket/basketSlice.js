import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


import { basketApi } from  './basketApi';
// ✅ Async thunks

export const fetchBasket = createAsyncThunk(
  'basket/getBasketItems',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching basket items');
      const result = await basketApi.fetchBasketItems();
      console.log('Basket data fetched successfully :', result);
      return result;
    } catch (error) {
     console.error('Error details:', error.response?.data?.message );
      
      
      return rejectWithValue( error.response?.data?.message || "Failed to fetch basket items");
    }
  }
);
export const addToBasket = createAsyncThunk(
  'basket/addToBasket',
  async ({ productId, quantity }, { rejectWithValue }) => {

    try {
      console.log('Adding to basket ', { productId, quantity });
      const result = await basketApi.addToBasket({ productId, quantity });
      console.log('Basket data added successfully :', result);
      return result;
    } catch (error) {
           console.error('Something went wrong:', error);
        return rejectWithValue(error.message);
    }
    }
 
);

export const removeFromBasket = createAsyncThunk(
  'basket/removeFromBasket',
  async ({ ProductId, Quantity }, { rejectWithValue }) => {

    try {
      console.log('Removing from basket ');
      const result = await basketApi.removeFromBasket({ ProductId, Quantity });
      console.log('Basket data removed successfully :', result);
      return result;
    } catch (error) {
           console.error('Something went wrong:', error);
        return rejectWithValue(error.message);
    }
    }
 
);

export const clearBasket = createAsyncThunk(
  'basket/clearBasket',
  async (_,{ rejectWithValue }) => {

    try {
      console.log('Clearing basket ');
      const result = await basketApi.clearBasket();
      console.log('Basket data cleared successfully :', result);
      return result;
    } catch (error) {
           console.error('Something went wrong:', error);
        return rejectWithValue(error.message);
    }
    }
 
);

// ✅ Initial state
const initialState = {
  basketId:"",
  total:0,
  itemCount:0,
  items: [],
  loading: false,
  error: null,
  
};

// ✅ Slice
const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      
    },

  },
  extraReducers: (builder) => {
    builder
      // Basket
      .addCase(fetchBasket.pending, (state) => {
        state.loading = true;
        state.error = null;

      }).addCase(fetchBasket.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total=action.payload.total
        state.itemCount=action.payload.itemCount
       
        console.log('basket data:', state.items);
      })
      .addCase(fetchBasket.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch basket items";
      
      }).addCase(addToBasket.fulfilled, (state, action) => {
  state.items = action.payload.items;
  state.total = action.payload.total;
  state.itemCount = action.payload.itemCount;
}).addCase(addToBasket.rejected, (state) => {
  state.loading = false;
  state.error = "Failed to add item to basket";
}).addCase(addToBasket.pending, (state) => {
 state.loading = true;
 state.error = null;
}).addCase(removeFromBasket.fulfilled, (state, action) => {
  state.items = action.payload.items;
  state.total = action.payload.total;
  state.itemCount = action.payload.itemCount;
}).addCase(removeFromBasket.rejected, (state) => {
  state.loading = false;
  state.error = "Failed to remove item from basket";
}).addCase(removeFromBasket.pending, (state) => {
  state.loading = true;
  state.error = null;
}).addCase(clearBasket.fulfilled, (state) => {
  state.items = [];
  state.total = 0;
  state.itemCount = 0;
}).addCase(clearBasket.rejected, (state) => {
  state.loading = false;
  state.error = "Failed to clear basket";
}).addCase(clearBasket.pending, (state) => {
  state.loading = true;
  state.error = null;
})
  },
});

export const { 
  clearError, 

} = basketSlice.actions;

// ✅ Selectors
export const selectBasketData = (state) => state.basket.items;
export const selectBasketTotalCount = (state) => state.basket.total; // The Number
export const selectBasketItemCount = (state) => state.basket.itemCount; // The Number
export const selectBasketError = (state) => state.basket.error;
export const selectBasketLoading = (state) => state.basket.loading;

export default basketSlice.reducer;