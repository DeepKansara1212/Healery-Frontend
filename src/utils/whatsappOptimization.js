// WhatsApp Integration Optimization Utilities
// Performance optimization and caching strategies

class WhatsAppOptimization {
    constructor() {
      this.cache = new Map()
      this.cacheExpiry = new Map()
      this.requestQueue = []
      this.isProcessing = false
      this.maxCacheSize = 50
      this.defaultTTL = 5 * 60 * 1000 // 5 minutes
    }
  
    /**
     * Get cached value with TTL check
     * @param {string} key - Cache key
     * @returns {any} Cached value or null
     */
    getFromCache(key) {
      const expiry = this.cacheExpiry.get(key)
      if (expiry && Date.now() > expiry) {
        this.cache.delete(key)
        this.cacheExpiry.delete(key)
        return null
      }
      return this.cache.get(key) || null
    }
  
    /**
     * Set cache value with TTL
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    setInCache(key, value, ttl = this.defaultTTL) {
      // Implement simple LRU eviction
      if (this.cache.size >= this.maxCacheSize) {
        const firstKey = this.cache.keys().next().value
        this.cache.delete(firstKey)
        this.cacheExpiry.delete(firstKey)
      }
  
      this.cache.set(key, value)
      this.cacheExpiry.set(key, Date.now() + ttl)
    }
  
    /**
     * Clear expired cache entries
     */
    clearExpiredCache() {
      const now = Date.now()
      for (const [key, expiry] of this.cacheExpiry.entries()) {
        if (now > expiry) {
          this.cache.delete(key)
          this.cacheExpiry.delete(key)
        }
      }
    }
  
    /**
     * Debounce function for frequent operations
     * @param {function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {function} Debounced function
     */
    debounce(func, delay = 300) {
      let timeoutId
      return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
      }
    }
  
    /**
     * Throttle function for rate limiting
     * @param {function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {function} Throttled function
     */
    throttle(func, limit = 1000) {
      let inThrottle
      return (...args) => {
        if (!inThrottle) {
          func(...args)
          inThrottle = true
          setTimeout(() => (inThrottle = false), limit)
        }
      }
    }
  
    /**
     * Queue and process requests to avoid overwhelming the API
     * @param {function} request - Request function
     * @returns {Promise} Request result
     */
    async queueRequest(request) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ request, resolve, reject })
        this.processQueue()
      })
    }
  
    /**
     * Process queued requests
     */
    async processQueue() {
      if (this.isProcessing || this.requestQueue.length === 0) return
  
      this.isProcessing = true
      const { request, resolve, reject } = this.requestQueue.shift()
  
      try {
        const result = await request()
        resolve(result)
      } catch (error) {
        reject(error)
      } finally {
        this.isProcessing = false
        // Process next request after a small delay
        setTimeout(() => this.processQueue(), 100)
      }
    }
  
    /**
     * Lazy load WhatsApp script
     * @returns {Promise} Script load promise
     */
    lazyLoadWhatsAppScript() {
      return new Promise((resolve, reject) => {
        if (window.WhatsAppWidget) {
          resolve()
          return
        }
  
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/whatsapp-web.js@latest/index.js"
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Failed to load WhatsApp script"))
        document.head.appendChild(script)
      })
    }
  
    /**
     * Preload critical resources
     */
    preloadResources() {
      // Preload WhatsApp icon
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = "https://cdn-icons-png.flaticon.com/512/733/733585.png"
      document.head.appendChild(link)
    }
  
    /**
     * Get performance metrics
     * @returns {object} Performance data
     */
    getPerformanceMetrics() {
      if (!window.performance) return null
  
      const navigation = performance.getEntriesByType("navigation")[0]
      const paint = performance.getEntriesByType("paint")
  
      return {
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
        firstPaint: paint.find((p) => p.name === "first-paint")?.startTime,
        firstContentfulPaint: paint.find((p) => p.name === "first-contentful-paint")?.startTime,
        cacheSize: this.cache.size,
        queueLength: this.requestQueue.length,
      }
    }
  
    /**
     * Clear all cache
     */
    clearAllCache() {
      this.cache.clear()
      this.cacheExpiry.clear()
    }
  }
  
  export default new WhatsAppOptimization()
  