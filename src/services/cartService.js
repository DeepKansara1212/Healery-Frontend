import api, { handleApiError } from '../utils/api';

export const cartService = {
  // Get user cart
  async getCart() {
    try {
      const response = await api.get('/cart');
      return response.data.cart;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      return response.data.cart;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Update cart item quantity
  async updateCartItem(productId, quantity) {
    try {
      const response = await api.put('/cart/update', { productId, quantity });
      return response.data.cart;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Remove item from cart
  async removeFromCart(productId) {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      return response.data.cart;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Clear cart
  async clearCart() {
    try {
      const response = await api.delete('/cart/clear');
      return response.data.cart;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get cart summary
  async getCartSummary() {
    try {
      const response = await api.get('/cart/summary');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Sync local cart with server (for guest users who become authenticated)
  async syncLocalCart(localCart) {
    try {
      if (!localCart || localCart.length === 0) return;
      
      // Add each local cart item to server cart
      for (const item of localCart) {
        try {
          await this.addToCart(item.product || item.id, item.quantity);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }
      
      // Clear local cart after successful sync
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default cartService;
