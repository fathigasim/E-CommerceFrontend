import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryApi } from './categoryApi';




export const getCategory = createAsyncThunk(
  'category/getCategory',
  async (_, { rejectWithValue }) => {
    try {
      const result = await categoryApi.fetchCategories();
        console.log('Thunk Categories Data :', result.data);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const result = await categoryApi.AddCategory(categoryData);
        console.log('Thunk Categories Data :', result.data);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// ✅ Initial state
const initialState = {

  items: [],
  loading: false,
   status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,

};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      
    },

  },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  extraReducers: (builder) => {
    builder
      // Order                              
      .addCase(getCategory.pending, (state) => {
         state.status = 'loading';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        state.error = null;

      }).addCase(getCategory.fulfilled, (state, action) => {
         state.status = 'succeeded';
        state.items = action.payload;
        console.log('category data:', action.payload);
   
      })
      .addCase(getCategory.rejected, (state) => {                                                                                                                                                                                                                         
            state.status = 'failed';
        state.error = "some went wrong";
      
      }).addCase(addCategory.fulfilled, (state, action) => {
         state.status = 'succeeded';
        
        console.log('category data:', action.payload);
    }).addCase(addCategory.pending, (state) => {
         state.status = 'loading';
        state.error = null;
    })
       .addCase(addCategory.rejected, (state) => {                                                                                                                                                                                                                         
            state.status = 'failed';
        state.error = "some went wrong";
    })
  },
});
  
    export const { clearError } = categorySlice.actions;
export const selectCategoryData = (state) => state.category.items                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ;
export const selectCategoryLoading = (state) => state.category.status === 'loading';

    export default categorySlice.reducer;