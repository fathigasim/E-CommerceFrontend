import api from '../../services/api';
 
 export const orderApi = {
 fetchOrders: async ({q,pageNumber,pageSize}) => {
    const response = await api.get('/Order/GetOrders', { params: {q, pageNumber, pageSize } });
    console.log(`api order data : ${response.data}`)
    return response.data;
  },
    addOrder: async (paymentIntentId = null) => {
    const response = await api.post('/Order/CreateOrder', {
      paymentIntentId: paymentIntentId
    });
    return response.data;
  },

}



// // orderSlice.js
// export const createOrder = createAsyncThunk(
//   'order/createOrder',
//   async (paymentIntentId, { rejectWithValue }) => {
//     try {
//       const result = await orderApi.addOrder(paymentIntentId);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Component
// const handlePaymentSuccess = async (paymentIntent) => {
//   console.log('✅ Payment succeeded:', paymentIntent);
//   toast.success('Payment successful!');

//   try {
//     // Pass paymentIntent.id to createOrder
//     const result = await dispatch(createOrder(paymentIntent.id)).unwrap();
//     console.log('✅ Order created:', result);
//     toast.success('Order created successfully!');
//   } catch (error) {
//     console.error('❌ Order creation failed:', error);
//     toast.error('Failed to create order');
//   }
// };