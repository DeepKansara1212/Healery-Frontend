// WhatsApp Integration Configuration
// This file contains all WhatsApp-related configuration and constants

export const WHATSAPP_CONFIG = {
    // Primary business WhatsApp number (with country code, no + or spaces)
    primaryNumber: "918010987439",
  
    // Department/Agent configuration
    departments: {
      sales: {
        id: "sales",
        name: "Sales & Inquiries",
        number: "918010987439",
        description: "Product information and bulk orders",
        availability: {
          monday: { start: "09:00", end: "18:00" },
          tuesday: { start: "09:00", end: "18:00" },
          wednesday: { start: "09:00", end: "18:00" },
          thursday: { start: "09:00", end: "18:00" },
          friday: { start: "09:00", end: "18:00" },
          saturday: { start: "10:00", end: "16:00" },
          sunday: { start: "10:00", end: "14:00" },
        },
      },
      support: {
        id: "support",
        name: "Customer Support",
        number: "918010987439",
        description: "Order tracking and technical support",
        availability: {
          monday: { start: "08:00", end: "20:00" },
          tuesday: { start: "08:00", end: "20:00" },
          wednesday: { start: "08:00", end: "20:00" },
          thursday: { start: "08:00", end: "20:00" },
          friday: { start: "08:00", end: "20:00" },
          saturday: { start: "09:00", end: "18:00" },
          sunday: { start: "09:00", end: "18:00" },
        },
      },
      returns: {
        id: "returns",
        name: "Returns & Refunds",
        number: "918010987439",
        description: "Return requests and refund inquiries",
        availability: {
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "17:00" },
          saturday: { start: "10:00", end: "15:00" },
          sunday: null, // Closed on Sunday
        },
      },
    },
  
    // Message templates for different scenarios
    messageTemplates: {
      general: "Hi! I would like to know more about your products.",
      productInquiry: (productName) => `Hi! I am interested in ${productName}. Can you provide more details?`,
      bulkOrder: "Hi! I am interested in placing a bulk order. Can we discuss the details?",
      orderTracking: (orderId) => `Hi! I would like to track my order #${orderId}.`,
      support: "Hi! I need help with my order. Can you assist me?",
      returns: "Hi! I would like to initiate a return for my order.",
      feedback: "Hi! I have some feedback about my recent purchase.",
    },
  
    // UI Configuration
    ui: {
      buttonPosition: "bottom-right", // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
      buttonSize: "medium", // 'small', 'medium', 'large'
      showLabel: true,
      animationEnabled: true,
      displayMode: "floating", // 'floating', 'inline', 'both'
    },
  
    // Performance & Security
    performance: {
      lazyLoadDelay: 2000, // ms - delay before loading WhatsApp widget
      cacheStatusDuration: 300000, // 5 minutes - cache agent status
      requestTimeout: 5000, // ms - timeout for status check requests
    },
  
    // Fallback options
    fallback: {
      enablePhoneCall: true,
      enableEmail: true,
      enableContactForm: true,
      phoneNumber: "+1-800-123-4567",
      email: "support@healeri.com",
    },
  
    // Analytics & Tracking
    tracking: {
      enableTracking: true,
      trackPageViews: true,
      trackConversions: true,
    },
  }
  
  // Helper function to get WhatsApp URL
  export const getWhatsAppURL = (phoneNumber, message = "") => {
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber}${message ? `?text=${encodedMessage}` : ""}`
  }
  
  // Helper function to get department by ID
  export const getDepartmentById = (departmentId) => {
    return WHATSAPP_CONFIG.departments[departmentId] || null
  }
  
  // Helper function to get all departments
  export const getAllDepartments = () => {
    return Object.values(WHATSAPP_CONFIG.departments)
  }
  
  // Helper function to format phone number for display
  export const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "")
  
    // Format as +CC XXX XXX XXXX
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
    }
    return phoneNumber
  }
  