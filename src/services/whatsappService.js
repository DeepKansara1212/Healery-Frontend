// WhatsApp Service
// Handles all WhatsApp-related operations including status checks, message generation, and URL creation

import { WHATSAPP_CONFIG, getWhatsAppURL, getDepartmentById } from "../config/whatsapp.config"

class WhatsAppService {
  constructor() {
    this.statusCache = {}
    this.cacheTimestamps = {}
  }

  /**
   * Get WhatsApp URL for a specific department or number
   * @param {string} departmentId - Department ID or phone number
   * @param {string} message - Optional message to send
   * @returns {string} WhatsApp URL
   */
  getWhatsAppLink(departmentId, message = "") {
    const department = getDepartmentById(departmentId)
    const phoneNumber = department ? department.number : departmentId
    return getWhatsAppURL(phoneNumber, message)
  }

  /**
   * Get WhatsApp link with predefined message template
   * @param {string} departmentId - Department ID
   * @param {string} templateKey - Message template key
   * @param {any} templateData - Data to populate template
   * @returns {string} WhatsApp URL with message
   */
  getWhatsAppLinkWithTemplate(departmentId, templateKey, templateData = null) {
    const template = WHATSAPP_CONFIG.messageTemplates[templateKey]
    let message = ""

    if (typeof template === "function") {
      message = template(templateData)
    } else {
      message = template
    }

    return this.getWhatsAppLink(departmentId, message)
  }

  /**
   * Check if a department is currently available
   * @param {string} departmentId - Department ID
   * @returns {boolean} True if department is available
   */
  isDepartmentAvailable(departmentId) {
    const department = getDepartmentById(departmentId)
    if (!department) return false

    const now = new Date()
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

    const daySchedule = department.availability[dayName]
    if (!daySchedule) return false // Closed on this day

    return currentTime >= daySchedule.start && currentTime <= daySchedule.end
  }

  /**
   * Get availability status for all departments
   * @returns {object} Availability status for each department
   */
  getAllDepartmentStatus() {
    const status = {}
    Object.keys(WHATSAPP_CONFIG.departments).forEach((deptId) => {
      status[deptId] = this.isDepartmentAvailable(deptId)
    })
    return status
  }

  /**
   * Get next available time for a department
   * @param {string} departmentId - Department ID
   * @returns {string} Next available time or message
   */
  getNextAvailableTime(departmentId) {
    const department = getDepartmentById(departmentId)
    if (!department) return "Department not found"

    const now = new Date()
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const currentTime = now.toTimeString().slice(0, 5)

    const daySchedule = department.availability[dayName]

    if (daySchedule && currentTime < daySchedule.start) {
      return `Available today at ${daySchedule.start}`
    }

    if (daySchedule && currentTime <= daySchedule.end) {
      return "Available now"
    }

    // Find next available day
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const currentDayIndex = days.indexOf(dayName)

    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7
      const nextDay = days[nextDayIndex]
      const nextDaySchedule = department.availability[nextDay]

      if (nextDaySchedule) {
        return `Available ${nextDay} at ${nextDaySchedule.start}`
      }
    }

    return "Schedule not available"
  }

  /**
   * Track WhatsApp click event
   * @param {string} departmentId - Department ID
   * @param {string} source - Page or component where click originated
   */
  trackWhatsAppClick(departmentId, source) {
    if (!WHATSAPP_CONFIG.tracking.enableTracking) return

    const event = {
      type: "whatsapp_click",
      department: departmentId,
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }

    // Store in localStorage for analytics
    try {
      const events = JSON.parse(localStorage.getItem("whatsapp_events") || "[]")
      events.push(event)
      // Keep only last 100 events
      if (events.length > 100) events.shift()
      localStorage.setItem("whatsapp_events", JSON.stringify(events))
    } catch (error) {
      console.error("Error tracking WhatsApp click:", error)
    }
  }

  /**
   * Get analytics data
   * @returns {object} Analytics data
   */
  getAnalytics() {
    try {
      const events = JSON.parse(localStorage.getItem("whatsapp_events") || "[]")
      return {
        totalClicks: events.length,
        clicksByDepartment: this._groupBy(events, "department"),
        clicksBySource: this._groupBy(events, "source"),
        events,
      }
    } catch (error) {
      console.error("Error retrieving analytics:", error)
      return { totalClicks: 0, clicksByDepartment: {}, clicksBySource: {}, events: [] }
    }
  }

  /**
   * Helper function to group array by property
   * @private
   */
  _groupBy(array, property) {
    return array.reduce((acc, obj) => {
      const key = obj[property]
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }

  /**
   * Clear analytics data
   */
  clearAnalytics() {
    try {
      localStorage.removeItem("whatsapp_events")
    } catch (error) {
      console.error("Error clearing analytics:", error)
    }
  }

  /**
   * Get fallback contact options
   * @returns {object} Fallback contact information
   */
  getFallbackOptions() {
    return WHATSAPP_CONFIG.fallback
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} True if valid
   */
  isValidPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "")
    return cleaned.length >= 10 && cleaned.length <= 15
  }
}

export default new WhatsAppService()
