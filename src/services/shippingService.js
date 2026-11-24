import api, { handleApiError } from "../utils/api"

export const shippingService = {
  // Create shipment
  async createShipment(orderId) {
    try {
      const response = await api.post("/shipping/create-shipment", { orderId })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Track shipment
  async trackShipment(orderId) {
    try {
      const response = await api.get(`/shipping/track/${orderId}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Check serviceability
  async checkServiceability(pincode, weight = 0.5, cod = false) {
    try {
      const response = await api.post("/shipping/check-serviceability", {
        pincode,
        weight,
        cod,
      })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get all shipments (Admin only)
  async getAllShipments(page = 1, limit = 10) {
    try {
      const response = await api.get(`/shipping/shipments?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}

export default shippingService;