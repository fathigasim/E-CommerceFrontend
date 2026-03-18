import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import paymentsReducer from '../features/payments/paymentsSlice';
import productReducer from  '../features/product/productSlice';
import basketReducer from '../features/basket/basketSlice';
import orderReducer from '../features/order/orderSlice';  
import categoryReducer from '../features/category/categorySlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    payments: paymentsReducer,
    product:productReducer,
    basket: basketReducer,
    order: orderReducer,
    category: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore stripe objects in actions
        ignoredActions: ['payments/setStripeElements'],
        ignoredPaths: ['payments.stripeElements'],
      },
    }),
});


// export  RootState =  store.getState;
// export  AppDispatch = tpeof store.dispatch;