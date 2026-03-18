 import api from '../../services/api';
 
 export const productApi = {
 fetchProduct: async (params) => {
    const response = await api.get('/Product/PagedProducts', {params});
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
   fetchProductById: async (Id) => {
    const response = await api.get(`/Product/${Id}`);
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
    addProduct: async (data) => {
    const response = await api.post('/Product', data,{headers :{ 'Content-Type':'multipart/form-data'}});
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
     updateProduct: async (Id, formData) => {
    const response = await api.put(`/Product/${Id}`, formData,{headers :{ 'Content-Type':'multipart/form-data'}});
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
}
  // Get payment details
  // getPayment: async (paymentId) => {
  //   const response = await api.get(`/payments/${paymentId}`);
  //   return response.data;
  // }