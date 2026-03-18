import api from '../../services/api';
 
 export const categoryApi = {
 fetchCategories: async () => {
    const response = await api.get('/Category');
    console.log(`api category data :`, response.data.data)
    return response.data;
  },
   

}