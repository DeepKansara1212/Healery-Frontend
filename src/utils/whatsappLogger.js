// WhatsApp Integration Logging & Monitoring
// Comprehensive logging for debugging and monitoring

class WhatsAppLogger {
    constructor() {
      this.logs = []
      this.maxLogs = 1000
      this.logLevel = "info" // debug, info, warn, error
    }
  
    /**
     * Log message with context
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {object} context - Additional context
     */
    log(level, message, context = {}) {
      const timestamp = new Date().toISOString()
      const logEntry = {
        timestamp,
        level,
        message,
        context,
        userAgent: navigator.userAgent,
      }
  
      this.logs.push(logEntry)
  
      // Keep logs size manageable
      if (this.logs.length > this.maxLogs) {
        this.logs.shift()
      }
  
      // Console output based on level
      const consoleMethod = level === "error" ? "error" : level === "warn" ? "warn" : "log"
      console[consoleMethod](`[WhatsApp ${level.toUpperCase()}] ${message}`, context)
  
      // Store in localStorage for persistence
      this.persistLogs()
    }
  
    /**
     * Log debug message
     * @param {string} message - Message
     * @param {object} context - Context
     */
    debug(message, context) {
      this.log("debug", message, context)
    }
  
    /**
     * Log info message
     * @param {string} message - Message
     * @param {object} context - Context
     */
    info(message, context) {
      this.log("info", message, context)
    }
  
    /**
     * Log warning message
     * @param {string} message - Message
     * @param {object} context - Context
     */
    warn(message, context) {
      this.log("warn", message, context)
    }
  
    /**
     * Log error message
     * @param {string} message - Message
     * @param {object} context - Context
     */
    error(message, context) {
      this.log("error", message, context)
    }
  
    /**
     * Persist logs to localStorage
     */
    persistLogs() {
      try {
        const recentLogs = this.logs.slice(-100) // Keep last 100 logs
        localStorage.setItem("whatsapp_logs", JSON.stringify(recentLogs))
      } catch (error) {
        console.error("Error persisting logs:", error)
      }
    }
  
    /**
     * Get all logs
     * @returns {array} Array of log entries
     */
    getLogs() {
      return this.logs
    }
  
    /**
     * Get logs by level
     * @param {string} level - Log level to filter
     * @returns {array} Filtered logs
     */
    getLogsByLevel(level) {
      return this.logs.filter((log) => log.level === level)
    }
  
    /**
     * Clear all logs
     */
    clearLogs() {
      this.logs = []
      localStorage.removeItem("whatsapp_logs")
    }
  
    /**
     * Export logs as JSON
     * @returns {string} JSON string of logs
     */
    exportLogs() {
      return JSON.stringify(this.logs, null, 2)
    }
  
    /**
     * Get performance summary
     * @returns {object} Performance data
     */
    getPerformanceSummary() {
      const errorLogs = this.getLogsByLevel("error")
      const warnLogs = this.getLogsByLevel("warn")
  
      return {
        totalLogs: this.logs.length,
        errors: errorLogs.length,
        warnings: warnLogs.length,
        lastError: errorLogs[errorLogs.length - 1] || null,
        lastWarning: warnLogs[warnLogs.length - 1] || null,
      }
    }
  }
  
  export default new WhatsAppLogger()
  