import api, { handleApiError } from '../utils/api';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data.order;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get user orders
  async getMyOrders(page = 1, limit = 10) {
    try {
      const response = await api.get(`/orders/myorders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update order payment status
  async updateOrderPayment(orderId, paymentData) {
    try {
      const response = await api.put(`/orders/${orderId}/pay`, paymentData);
      return response.data.order;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data.order;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Calculate order totals
  calculateOrderTotals(cartItems, shippingCost = 9.99, taxRate = 0.08) {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  },

  // Validate shipping address
  validateShippingAddress(address) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zipCode', 'country'];
    const missing = required.filter(field => !address[field] || address[field].trim() === '');
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Phone validation (basic)
    const phoneRegex = /^\+?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(address.phone.replace(/[\s()-]/g, ''))) {
      throw new Error('Please enter a valid phone number');
    }

    return true;
  }
};

export default orderService;
