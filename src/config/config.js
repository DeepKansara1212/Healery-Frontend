// Frontend Configuration
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: 'Healery',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_ANALYTICS: false,
  ENABLE_DEBUG_MODE: import.meta.env.DEV || false,
  
  // Pagination Defaults
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  
  // Image Configuration
  IMAGE_PLACEHOLDER: '/placeholder.svg',
  IMAGE_QUALITY: 80,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'token',
    USER_DATA: 'user',
    CART_DATA: 'cart',
    WISHLIST_DATA: 'wishlist',
    THEME: 'theme',
    LANGUAGE: 'language',
  },
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    PRODUCTS: {
      LIST: '/products',
      FEATURED: '/products?isFeatured=true',
      SEARCH: '/products/search',
      BY_CATEGORY: '/categories/:id/products',
    },
    CART: {
      GET: '/cart',
      ADD: '/cart/add',
      UPDATE: '/cart/update',
      REMOVE: '/cart/remove/:id',
      CLEAR: '/cart/clear',
      SUMMARY: '/cart/summary',
    },
    WISHLIST: {
      GET: '/wishlist',
      ADD: '/wishlist/add',
      REMOVE: '/wishlist/remove/:id',
      CLEAR: '/wishlist/clear',
      CHECK: '/wishlist/check/:id',
      COUNT: '/wishlist/count',
    },
    ORDERS: {
      CREATE: '/orders',
      LIST: '/orders/myorders',
      DETAILS: '/orders/:id',
      UPDATE: '/orders/:id',
      CANCEL: '/orders/:id/cancel',
    },
    REVIEWS: {
      PRODUCT: '/reviews/product/:id',
      CREATE: '/reviews',
      UPDATE: '/reviews/:id',
      DELETE: '/reviews/:id',
      USER: '/reviews/my-reviews',
    },
    USERS: {
      PROFILE: '/users/profile',
      UPDATE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
      FORGOT_PASSWORD: '/users/forgot-password',
      RESET_PASSWORD: '/users/reset-password/:token',
    },
    SHIPPING: {
      CREATE_SHIPMENT: '/shipping/create-shipment',
      TRACK: '/shipping/track/:orderId',
      CHECK_SERVICEABILITY: '/shipping/check-serviceability',
      SHIPMENTS: '/shipping/shipments',
    },
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please sign in to continue.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    DEFAULT: 'Something went wrong. Please try again.',
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    LOGIN: 'Successfully signed in!',
    REGISTER: 'Account created successfully!',
    LOGOUT: 'Successfully signed out!',
    PROFILE_UPDATE: 'Profile updated successfully!',
    PASSWORD_CHANGE: 'Password changed successfully!',
    CART_ADD: 'Product added to cart!',
    CART_REMOVE: 'Product removed from cart!',
    WISHLIST_ADD: 'Product added to wishlist!',
    WISHLIST_REMOVE: 'Product removed from wishlist!',
    REVIEW_CREATE: 'Review submitted successfully!',
    ORDER_CREATE: 'Order placed successfully!',
  },
  
  // Validation Rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 128,
    NAME_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 500,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  
  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
    LOADING_DELAY: 500,
    INFINITE_SCROLL_THRESHOLD: 100,
  },
};

export default config;
