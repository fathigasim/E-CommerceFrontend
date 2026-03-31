import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const tokenService = {
  // Get tokens
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  
  // Set tokens
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  
  // Clear tokens
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  // Get user data
 getUser: () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);

    if (!userStr || userStr === "undefined" || userStr === "null") {
      return null;
    }

    return JSON.parse(userStr);
  } catch (error) {
    console.error("Invalid user in localStorage:", error);
    localStorage.removeItem(USER_KEY); // cleanup bad data
    return null;
  }
},
  
  // Set user data
  setUser: (user) => {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
},
  
  // Check if token is expired
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },
  
  // Get token expiration time
  getTokenExpiration: (token) => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000; // Convert to milliseconds
    } catch (error) {
      return null;
    }
  },
  
  // ✅ FIXED: Get user ID from token (handles .NET ClaimTypes)
  getUserIdFromToken: (token) => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      
      console.log('🔍 Decoded token:', decoded); // Debug
      
      // ✅ Try different claim names (.NET uses long URL format)
      return (
        decoded.sub || 
        decoded.nameid || 
        decoded.userId ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || //  .NET NameIdentifier
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'] ||
        null
      );
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },
  
  // ✅ BONUS: Get email from token
  getEmailFromToken: (token) => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return (
        decoded.email ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        null
      );
    } catch (error) {
      return null;
    }
  },
  
  // ✅ BONUS: Get username from token
  getUserNameFromToken: (token) => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return (
        decoded.name ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        null
      );
    } catch (error) {
      return null;
    }
  },

  getUserRoles(token) {
  try {
    const decoded = jwtDecode(token);
    
    // Check for ASP.NET Core Identity role claim format
    const aspNetRoles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    
    if (aspNetRoles) {
      // Role claim can be a string or array
      return Array.isArray(aspNetRoles) ? aspNetRoles : [aspNetRoles];
    }
    
    // Fallback to simple 'role' claim
    const simpleRoles = decoded.role;
    if (simpleRoles) {
      return Array.isArray(simpleRoles) ? simpleRoles : [simpleRoles];
    }
    
    return [];
  } catch (error) {
    console.error('Error extracting roles from token:', error);
    return [];
  }
}
};