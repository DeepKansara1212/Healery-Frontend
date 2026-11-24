import api, { handleApiError } from '../utils/api';

export const wishlistService = {
  // Get user wishlist
  async getWishlist() {
    try {
      const response = await api.get('/wishlist');
      return response?.data?.wishlist;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Add item to wishlist
  async addToWishlist(productId) {
    try {
      const response = await api.post(`/wishlist/add`, { productId });
      return response?.data?.wishlist;
    } catch (error) {
      console.error('Add to wishlist error:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Remove item from wishlist
  async removeFromWishlist(productId) {
    try {
      const response = await api.delete(`/wishlist/remove/${productId}`);
      return response?.data?.wishlist;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Clear wishlist
  async clearWishlist() {
    try {
      const response = await api.delete('/wishlist/clear');
      return response?.data?.wishlist;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Move wishlist item to cart
  async moveToCart(productId, quantity = 1) {
    try {
      const response = await api.post(`/wishlist/move-to-cart/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Check if product is in wishlist
  async checkWishlistItem(productId) {
    try {
      const response = await api.get(`/wishlist/check/${productId}`);
      return response.data.isInWishlist;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get wishlist count
  async getWishlistCount() {
    try {
      const response = await api.get('/wishlist/count');
      return response.data.count;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Sync local wishlist with server (for guest users who become authenticated)
  async syncLocalWishlist(localWishlist) {
    try {
      if (!localWishlist || localWishlist.length === 0) return;
      
      // Add each local wishlist item to server wishlist
      for (const item of localWishlist) {
        try {
          await this.addToWishlist(item.product || item.id);
        } catch (error) {
          console.error(`Failed to sync wishlist item ${item.id}:`, error);
        }
      }
      
      // Clear local wishlist after successful sync
      localStorage.removeItem('wishlist');
      window.dispatchEvent(new Event('wishlistUpdated'));
      
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default wishlistService;
