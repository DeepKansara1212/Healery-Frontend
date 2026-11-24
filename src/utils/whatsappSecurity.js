// WhatsApp Integration Security Utilities
// Input validation, sanitization, and security checks

class WhatsAppSecurity {
  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid
   */
  validatePhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Check if it's a valid length (10-15 digits for international)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return false;
    }

    // Check if it starts with country code or 0
    if (!cleaned.match(/^[1-9]\d{9,14}$/)) {
      return false;
    }

    return true;
  }

  /**
   * Sanitize user input to prevent XSS
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input !== "string") return "";

    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  /**
   * Validate message content
   * @param {string} message - Message to validate
   * @returns {object} Validation result
   */
  validateMessage(message) {
    const errors = [];

    if (!message || typeof message !== "string") {
      errors.push("Message must be a non-empty string");
    }

    if (message.length > 4096) {
      errors.push("Message exceeds maximum length of 4096 characters");
    }

    // Check for suspicious patterns
    if (this.containsSuspiciousPatterns(message)) {
      errors.push("Message contains suspicious content");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check for suspicious patterns in message
   * @param {string} message - Message to check
   * @returns {boolean} True if suspicious patterns found
   */
  containsSuspiciousPatterns(message) {
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi, // Script tags
      /javascript:/gi, // JavaScript protocol
      /on\w+\s*=/gi, // Event handlers
      /eval\(/gi, // Eval function
      /expression\(/gi, // CSS expressions
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(message));
  }

  /**
   * Validate department ID
   * @param {string} departmentId - Department ID to validate
   * @returns {boolean} True if valid
   */
  validateDepartmentId(departmentId) {
    // Only allow alphanumeric and underscore
    return /^[a-zA-Z0-9_]+$/.test(departmentId);
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Hash sensitive data (client-side)
   * @param {string} data - Data to hash
   * @returns {string} Hash of data
   */
  async hashData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Generate secure random token
   * @param {number} length - Token length
   * @returns {string} Random token
   */
  generateSecureToken(length = 32) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      token += chars[array[i] % chars.length];
    }

    return token;
  }

  /**
   * Check for rate limiting
   * @param {string} identifier - User identifier
   * @param {number} maxRequests - Max requests allowed
   * @param {number} timeWindow - Time window in milliseconds
   * @returns {boolean} True if rate limit exceeded
   */
  checkRateLimit(identifier, maxRequests = 10, timeWindow = 60000) {
    const key = `rateLimit_${identifier}`;
    const now = Date.now();

    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      const recentRequests = data.filter(
        (timestamp) => now - timestamp < timeWindow
      );

      if (recentRequests.length >= maxRequests) {
        return true;
      }

      recentRequests.push(now);
      localStorage.setItem(key, JSON.stringify(recentRequests));
      return false;
    } catch (error) {
      console.error("Rate limit check error:", error);
      return false;
    }
  }

  /**
   * Validate configuration object
   * @param {object} config - Configuration to validate
   * @returns {object} Validation result
   */
  validateConfig(config) {
    const errors = [];

    if (!config.phoneNumber || !this.validatePhoneNumber(config.phoneNumber)) {
      errors.push("Invalid phone number");
    }

    if (!config.businessName || typeof config.businessName !== "string") {
      errors.push("Invalid business name");
    }

    if (config.fallback?.email && !this.validateEmail(config.fallback.email)) {
      errors.push("Invalid fallback email");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Encrypt sensitive data (basic client-side encryption)
   * @param {string} data - Data to encrypt
   * @param {string} key - Encryption key
   * @returns {string} Encrypted data
   */
  encryptData(data, key) {
    try {
      // Simple XOR encryption for client-side storage
      let encrypted = "";
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return btoa(encrypted);
    } catch (error) {
      console.error("Encryption error:", error);
      return data;
    }
  }

  /**
   * Decrypt sensitive data
   * @param {string} encrypted - Encrypted data
   * @param {string} key - Decryption key
   * @returns {string} Decrypted data
   */
  decryptData(encrypted, key) {
    try {
      const data = atob(encrypted);
      let decrypted = "";
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      return encrypted;
    }
  }
}

export default new WhatsAppSecurity();
