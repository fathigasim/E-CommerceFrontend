 import api from '../../services/api';
 
 export const basketApi = {
 fetchBasketItems: async () => {
    const response = await api.get('/Basket/GetBasket');
    console.log(`api basket data : ${response.data}`)
    return response.data;
  },
    addToBasket: async ({ productId, quantity }) => {
    const response = 
    await api.post('/Basket/Add', {
     productId: productId,
     quantity: quantity,
    });
    return response.data;
    },
    removeFromBasket: async ({ productId, quantity }) => {
    const response = await api.post('/Basket/Remove', {
    productId: productId,
    quantity: quantity,
    });
    return response.data;
    },
    clearBasket: async () => {
    const response = await api.post('/Basket/Clear');
    return response.data;
    }
}