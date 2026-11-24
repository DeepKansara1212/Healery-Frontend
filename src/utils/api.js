// API Configuration and Utilities for Healery Frontend

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// API Response Handler
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const validationMessages = Array.isArray(errorData.errors)
      ? errorData.errors.map(({ msg }) => msg).filter(Boolean)
      : [];
    const message = validationMessages.length
      ? validationMessages.join(". ")
      : errorData.message || `HTTP error! status: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const defaultOptions = {
    headers,
    credentials: 'include',
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    return handleApiResponse(response);
  } catch (error) {
    if (error.status) throw error;
    throw new Error('Network error. Please check your connection.');
  }
};

// API Methods
export const api = {
  // GET request
  get: (endpoint) => apiRequest(endpoint),
  
  // POST request
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // PUT request
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // DELETE request
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
  
  // PATCH request
  patch: (endpoint, data) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

// Auth Utilities
export const auth = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },
  
  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  },
  
  // Get auth token
  getToken: () => localStorage.getItem('token'),
  
  // Set auth data
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Update user data
  updateUser: (userData) => {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },
};

// Cart Utilities
export const cart = {
  // Get cart from localStorage
  getCart: () => {
    const cartData = localStorage.getItem('cart');
    if (!cartData) return [];
    try {
      const parsed = JSON.parse(cartData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem('cart');
      return [];
    }
  },
  
  // Update cart in localStorage
  updateCart: (cartData) => {
    localStorage.setItem('cart', JSON.stringify(cartData));
    // Dispatch event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
  },
  
  // Clear cart
  clearCart: () => {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  },
};

// Wishlist Utilities
export const wishlist = {
  // Get wishlist from localStorage
  getWishlist: () => {
    const wishlistData = localStorage.getItem('wishlist');
    if (!wishlistData) return [];
    try {
      const parsed = JSON.parse(wishlistData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem('wishlist');
      return [];
    }
  },
  
  // Update wishlist in localStorage
  updateWishlist: (wishlistData) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistData));
    // Dispatch event to update wishlist count
    window.dispatchEvent(new Event('wishlistUpdated'));
  },
  
  // Clear wishlist
  clearWishlist: () => {
    localStorage.removeItem('wishlist');
    window.dispatchEvent(new Event('wishlistUpdated'));
  },
};

// Error handling
export const handleApiError = (error) => {
  if (error.status === 401) {
    auth.clearAuth();
    window.location.href = '/signin';
    return 'Please sign in to continue';
  }
  
  return error.message || 'Something went wrong. Please try again.';
};

export default api;

