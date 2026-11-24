import api, { handleApiError } from '../utils/api';

export const productService = {
  // Get all products with pagination and filters
  async getProducts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
      console.log("Making API request to:", endpoint);
      const result = await api.get(endpoint);
      console.log("API response:", result);
      // Backend returns { success: true, data: { products, pagination } }
      // api.get already returns the parsed JSON, so result IS the full response
      return result;
    } catch (error) {
      console.error("API error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      // Backend returns { success, data: { products } }
      const result = await api.get('/products/featured?limit=8');
      return result.data || { products: [] };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get product by ID
  async getProductById(productId) {
    try {
      const result = await api.get(`/products/${productId}`);
      // Backend returns { success, data: { product } }
      return result.data?.product;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Search products
  async searchProducts(query, params = {}) {
    try {
      const searchParams = { ...params, search: query };
      const queryString = new URLSearchParams(searchParams).toString();
      const endpoint = `/products/search?${queryString}`;
      const result = await api.get(endpoint);
      return result.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      // Backend route: GET /api/products/category/:categoryId
      const endpoint = `/products/category/${categoryId}${queryString ? `?${queryString}` : ''}`;
      const result = await api.get(endpoint);
      return result.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get all categories
  async getCategories() {
    try {
      console.log("Making categories API request...");
      const response = await api.get('/categories');
      console.log("Categories API response:", response);
      // Backend returns { success: true, data: { categories: [...] } }
      return response?.data?.categories || [];
    } catch (error) {
      console.error("Categories API error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Get category by ID
  async getCategoryById(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return response.data.category;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get product reviews
  async getProductReviews(productId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create product review
  async createReview(reviewData) {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update product review
  async updateReview(reviewId, reviewData) {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete product review
  async deleteReview(reviewId) {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Upload product images (admin only)
  async uploadProductImages(formData) {
    try {
      const response = await api.post('/admin/uploads/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default productService;
