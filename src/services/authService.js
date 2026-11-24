import api, { auth, cart, handleApiError, wishlist } from '../utils/api';
import cartService from './cartService';
import wishlistService from './wishlistService';

export const authService = {
  // User Registration
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.success) {
        const { token, user } = response.data;
        auth.setAuth(token, user);
      }
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // User Login
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.success) {
        const { token, user } = response.data;
        auth.setAuth(token, user);
        return response;
      }
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async loginWithGoogle(credential) {
    try {
      const response = await api.post('/auth/google', { credential });
      if (response.success) {
        auth.setAuth(response.data.token, response.data.user);
      }
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async syncLocalData() {
    const localCart = cart.getCart();
    const localWishlist = wishlist.getWishlist();

    if (localCart.length > 0) {
      try {
        await cartService.syncLocalCart(localCart);
      } catch (error) {
        console.error('Failed to sync cart after sign-in:', error);
      }
    }

    if (localWishlist.length > 0) {
      try {
        await wishlistService.syncLocalWishlist(localWishlist);
      } catch (error) {
        console.error('Failed to sync wishlist after sign-in:', error);
      }
    }
  },

  // User Logout
  async logout() {
    try {
      // Call logout endpoint if you have one
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      auth.clearAuth();
      // Clear cart and wishlist
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      window.location.href = '/';
    }
  },

  // Get Current User Profile
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      if (response.success) {
        auth.updateUser(response.data.user);
        return {
          user: response.data.user,
          orderStats: response.data.orderStats
        };
      }
      return null;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update User Profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/users/profile', userData);
      if (response.success) {
        auth.updateUser(response.data.user);
        return response.data.user;
      }
      return null;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Change Password
  async changePassword(passwordData) {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Forgot Password
  // Add these methods to authService
  
  // Request password reset
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  // Reset password with token
  async resetPassword(token, password) {
    try {
      const response = await api.put(`/auth/reset-password/${token}`, { password });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => auth.isAuthenticated(),

  // Get current user
  getCurrentUser: () => auth.getCurrentUser(),

  // Get auth token
  getToken: () => auth.getToken(),

  // Get user's recent orders for profile page
  async getProfileOrders(page = 1, limit = 5) {
    try {
      const response = await api.get(`/users/profile/orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default authService;
