import api, { handleApiError } from "../utils/api"

export const paymentService = {
  // Create Razorpay order
  async createPaymentOrder(orderId) {
    try {
      const response = await api.post("/payments/create-order", { orderId })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Verify Razorpay payment
  async verifyPayment(paymentData) {
    try {
      const response = await api.post("/payments/verify-payment", paymentData)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Load Razorpay script
  loadRazorpayScript() {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true)
        return
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        existingScript.onload = () => resolve(true)
        existingScript.onerror = () => resolve(false)
        return
      }

      // Create and load new script
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => {
        if (window.Razorpay) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK")
        resolve(false)
      }
      document.body.appendChild(script)
    })
  },

  // Initialize Razorpay payment
  async initiatePayment(orderData, customerData, onSuccess, onFailure) {
    try {
      // Validate required data
      if (!orderData || !orderData.keyId || !orderData.orderId || !orderData.amount) {
        throw new Error("Invalid payment order data")
      }

      if (!customerData || !customerData.email || !customerData.phone) {
        throw new Error("Invalid customer data")
      }

      // Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please check your internet connection.")
      }

      // Verify Razorpay is available
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not available")
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount, // Amount in paise (already converted on backend)
        currency: orderData.currency || "INR",
        name: "Healery",
        description: `Order Payment - ${orderData.orderId}`,
        order_id: orderData.orderId,
        prefill: {
          name: `${customerData.firstName || ""} ${customerData.lastName || ""}`.trim() || customerData.email,
          email: customerData.email,
          contact: customerData.phone,
        },
        theme: {
          color: "#059669", // Emerald-600
        },
        handler: (response) => {
          // Validate response
          if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
            onFailure(new Error("Invalid payment response from Razorpay"))
            return
          }

          onSuccess({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
        },
        modal: {
          ondismiss: () => {
            onFailure(new Error("Payment cancelled by user"))
          },
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      }

      const razorpay = new window.Razorpay(options)
      
      // Handle payment errors
      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response)
        onFailure(new Error(response.error?.description || "Payment failed. Please try again."))
      })

      razorpay.open()
    } catch (error) {
      console.error("Payment initiation error:", error)
      onFailure(error)
    }
  },
}

export default paymentService
