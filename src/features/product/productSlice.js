import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


import { productApi } from './productApi';
// ✅ Async thunks

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async ({pageNumber,pageSize}) => {

     //  const state = store.getState();
   //const {page, pageSize } = state.products;

    // const params = {
    // //   q: overrideParams?.searchQuery ?? searchQuery ?? "",
    // //   category: overrideParams?.searchCategory ?? searchCategory ?? "",
    // //   sort: overrideParams?.sort ?? sort ?? "",
    //   pageNumber:searchP.pageNumber,// overrideParams?.page ?? page ?? 1,
    //   pageSize:4,
    // };


    try {
      console.log('Fetching Products');
      const result = await productApi.fetchProduct({pageNumber,pageSize:3});
      console.log('Products Data :', result);
      return result;
    } catch (error) {
      console.error('Something went wrong:', error);
     // return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (Id) => {
    try {
      console.log('Fetching Product by ID:', Id);
      const result = await productApi.fetchProductById(Id);
      console.log('Product Edit :', result);
      return result;
    } catch (error) {
      console.error('Something went wrong:', error);
      throw error;
    }
  }
);

export const addProducts = createAsyncThunk(
  'product/addProduct',
  async (product, { rejectWithValue }) => {
    try {
      const result = await productApi.addProduct(product);
      console.log('Added Product Data:', result);
      return result;
    } catch (error) {
      console.error('Error response data:', error.response?.data);

      // ✅ Handle array of errors
      const errors = error.response?.data;

      if (Array.isArray(errors)) {
        // If it's an array, join into a string or return as-is
        return rejectWithValue(errors);
      }

      // If it's an object with errors property
      if (errors?.errors) {
        return rejectWithValue(errors.errors);
      }

      // If it's an object with message
      if (errors?.message) {
        return rejectWithValue(errors.message);
      }

      return rejectWithValue("Failed to add product");
      //  console.error('Error response:', error.response?.data);

      // // Return standard ValidationProblemDetails format
      // return rejectWithValue({
      //   title: error.response?.data?.title || 'An error occurred',
      //   status: error.response?.data?.status || error.response?.status || 500,
      //   errors: error.response?.data?.errors || null
      // });
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ Id, formData }, { rejectWithValue }) => {
      for (let pair of formData.entries()) {
      console.log("THUNK:", pair[0], pair[1]);
    }

    try {

      const result = await productApi.updateProduct(Id, formData);
      console.log('Updated Product Data:', result);
      return result;
    } catch (error) {
      console.error('Error response data:', error.response?.data);

      // ✅ Handle array of errors
      const errors = error.response?.data;

      if (Array.isArray(errors)) {
        // If it's an array, join into a string or return as-is
        return rejectWithValue(errors);
      }

      // If it's an object with errors property
      if (errors?.errors) {
        return rejectWithValue(errors.errors);
      }

      // If it's an object with message
      if (errors?.message) {
        return rejectWithValue(errors.message);
      }

      return rejectWithValue("Failed to update product");
      //  console.error('Error response:', error.response?.data);

      // // Return standard ValidationProblemDetails format
      // return rejectWithValue({
      //   title: error.response?.data?.title || 'An error occurred',
      //   status: error.response?.data?.status || error.response?.status || 500,
      //   errors: error.response?.data?.errors || null
      // });
    }
  }
);
// export const fetchPayment = createAsyncThunk(
//   'payments/fetchPayment',
//   async (paymentId, { rejectWithValue }) => {
//     try {
//       return await paymentsApi.getPayment(paymentId);
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const refundPayment = createAsyncThunk(
//   'payments/refundPayment',
//   async ({ paymentId, amount, reason }, { rejectWithValue }) => {
//     try {
//       return await paymentsApi.refundPayment(paymentId, amount, reason);
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// ✅ Initial state
const initialState = {
pageNumber:1,
 pageSize:0,
 totalCount:0,
 totalPages:0,
  currentProduct: null, // product being edited/viewed
  items: [],
  loading: false,
  error: null,
  
};

// ✅ Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      
    },

  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items;
        state.pageNumber=action.payload.data.pageNumber
        state.pageSize=action.payload.data.pageSize
         state.totalPages=action.payload.data.totalpages
        state.totalCount=action.payload.data.totalCount
        console.log('Products data:', state.items);
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
        state.error = "some went wrong";
        console.error('Payment intent failed:', state.error);
      })  .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(fetchProductById.fulfilled, (state,action) => {
        state.loading = false;
        state.error = null;
        state.currentProduct = action.payload.data;
        console.log('Current Product data:', state.currentProduct);
      }) .addCase(fetchProductById.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }).addCase(addProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(addProducts.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      }).addCase(addProducts.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      }).addCase(updateProduct.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })  
  },
});

export const { 
  clearError, 

} = productSlice.actions;

// ✅ Selectors
export const selectProductItem = (state) => state.product.currentProduct;
export const selectProductData = (state) => state.product.items;
export const selectProductTotalCount = (state) => state.product.totalCount; // The Number
export const selectProductTotalPages = (state) => state.product.totalPages; // The Number
export const selectProductPageSize = (state) => state.product.pageSize; // The Number
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;


export default productSlice.reducer;