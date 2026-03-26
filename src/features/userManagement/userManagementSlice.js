import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userManagementApi } from "./userManagementApi";

export const resetPassword = createAsyncThunk(
  "userManagement/resetPassword",
  async ({ email, token, newPassword, newPasswordConfirm }, { rejectWithValue }) => {
    try {
      const res = await userManagementApi.resetPassword({
        email,
        token,
        newPassword,
        newPasswordConfirm,
      });
      return res;
    } catch (error) {
      console.error("Reset password error:", error);

      // Handle validation errors from ASP.NET
      // const validationErrors = error.response?.data?.errors;
      // if (validationErrors) {
      //   const messages = [];
      //   Object.keys(validationErrors).forEach(key => {
      //     messages.push(...validationErrors[key]);
      //   });
      //   return rejectWithValue({ message: messages.join(" ") });
      // }

      // Handle Result<T> failure from your backend
      // const errorMessage = err.response?.data?.errorMessage || 
      //                     err.response?.data?.message ||
      //                     "Error resetting password.";
      
      // return rejectWithValue({ message: errorMessage });
          const errors = error.response?.data;
    console.log("Reset password form error",errors)
       if (Array.isArray(errors)) {
        // If it's an array, join into a string or return as-is
        return rejectWithValue(errors);
      }

      // If it's an object with errors property
      if (errors?.errors) {
        return rejectWithValue(errors.errors);
      }
    }
  }
);
export const foregotPassword = createAsyncThunk(
  "userManagement/foregotPassword",
  async ({ email}, { rejectWithValue }) => {
     console.log("Thunk api email value before sending checking existance",email)
    try {
      const res = await userManagementApi.foregotPassword({
        email
      });
      console.log("Thunk api response foregot password",res.data)
      return res.data;
    } catch (error) {
      console.error("Foregot  password error:", error);

      // Handle validation errors from ASP.NET
      // const validationErrors = err.response?.data?.errors;
      // if (validationErrors) {
      //   const messages = [];
      //   Object.keys(validationErrors).forEach(key => {
      //     messages.push(...validationErrors[key]);
      //   });
      //   return rejectWithValue({ message: messages.join(" ") });
      // }

      // // Handle Result<T> failure from your backend
      // const errorMessage = err.response?.data?.errorMessage || 
      //                     err.response?.data?.message ||
      //                     "Error resetting password.";
      
      // return rejectWithValue({ message: errorMessage });
         const errors = error.response?.data;
       if (Array.isArray(errors)) {
        // If it's an array, join into a string or return as-is
        return rejectWithValue(errors);
      }

      // If it's an object with errors property
      if (errors?.errors) {
        return rejectWithValue(errors.errors);
      }
    }
  }
);
const initialState = {
  loading: false,
  success: false,
  data:"",
  error: null,
};

const userManagementSlice = createSlice({
  name: "usermanagement",
  initialState,
  reducers: {
    clearMessages(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Forgot Password
    builder
      .addCase(foregotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(foregotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(foregotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mailerror || "Unexpected error.";
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.isSuccess;
        state.data=action.payload.data
      })
      .addCase(resetPassword.rejected, (state) => {
        state.loading = false;
        state.success = null;
     //   state.error = action.payload?.errorMessage || "Reset password failed";
      });
  },
});

export const { clearMessages } = userManagementSlice.actions;
export const selectUsermanagementData = (state) => state.usermanagement.data;
export const selectUsermanagementLoading = (state) => state.usermanagement.loading;
export const selectUsermanagementSuccess = (state) => state.usermanagement.success;
export const selectUsermanagementError = (state) => state.usermanagement.error;
export default userManagementSlice.reducer;