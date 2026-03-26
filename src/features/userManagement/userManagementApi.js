 import api from '../../services/api';
 
 export const userManagementApi = {
  resetPassword: async ({ email, token, newPassword, newPasswordConfirm }) => {
    console.log("=== API LAYER DEBUG ===");
    console.log("Received in API layer:", { email, token, newPassword, newPasswordConfirm });

    const requestBody = {
      Email: email,
      Token: token,
      NewPassword: newPassword,
      NewPasswordConfirm: newPasswordConfirm,
    };
    const response = await api.post(`/UserManagement/ResetPassword`, requestBody);
    return response.data;
  },
 foregotPassword: async ({ email}) => {
    console.log("=== API LAYER DEBUG ===");
    console.log("Received in API layer:", { email});

    const requestBody = {
       Email:email,
    };
    const response = await api.post(`/UserManagement/ForegotPassword`, requestBody);
    return response.data;
  }
}