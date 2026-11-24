"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { CreditCard, Truck, Shield } from "lucide-react"
import orderService from "../services/orderService"
import paymentService from "../services/paymentService"
import { auth } from "../utils/api"
import WhatsAppInlineButton from "../components/WhatsAppInlineButton"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [orderTotals, setOrderTotals] = useState({
    subtotal: 0,
    shippingCost: 0,
    tax: 0,
    total: 0,
  })

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  })

  const [paymentMethod, setPaymentMethod] = useState("COD")

  // Move the nextStep function inside the component
  const nextStep = () => {
    if (currentStep === 1) {
      const missingFields = [
        ["firstName", "First Name"],
        ["lastName", "Last Name"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["country", "Country"],
        ["street", "Street Address"],
        ["city", "City"],
        ["state", "State"],
        ["zipCode", "Zip Code"],
      ].filter(([field]) => !String(shippingAddress[field] || "").trim())

      if (missingFields.length > 0) {
        alert(`Please fill in: ${missingFields.map(([, label]) => label).join(", ")}`)
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email.trim())) {
        alert("Please enter a valid email address")
        return
      }
    }

    setCurrentStep((step) => Math.min(step + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1))
  }

  const payableTotal = orderTotals.total

  // Load cart items and calculate totals
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        setCartItems(Array.isArray(cart) ? cart : [])

        if (cart.length > 0) {
          const totals = orderService.calculateOrderTotals(cart)
          setOrderTotals(totals)
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        setCartItems([])
      }
    }

    loadCart()
  }, [])

  // Auto-fill shipping address if user is authenticated
  useEffect(() => {
    if (auth.isAuthenticated()) {
      const user = auth.getCurrentUser()
      if (user) {
        setShippingAddress((prev) => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        }))
      }
    }
  }, [])

  // Respect preferred payment from product Buy Now
  useEffect(() => {
    const preferred = localStorage.getItem("preferredPayment")
    if (preferred === "Online" || preferred === "COD") {
      setPaymentMethod(preferred)
    }
    localStorage.removeItem("preferredPayment")
  }, [])

  const handleInputChange = (field, value) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePlaceOrder = async () => {
    if (!auth.isAuthenticated()) {
      alert("Please sign in to place an order")
      navigate("/signin")
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty")
      navigate("/cart")
      return
    }

    setIsLoading(true)

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: orderTotals.subtotal,
        shippingPrice: orderTotals.shippingCost,
        taxPrice: orderTotals.tax,
        discountPrice: 0,
        totalPrice: payableTotal,
      }

      // Create order first
      const order = await orderService.createOrder(orderData)

      if (paymentMethod === "COD") {
        // For COD, directly proceed to success
        localStorage.removeItem("cart")
        window.dispatchEvent(new Event("cartUpdated"))
        navigate(`/order-success/${order._id}`)
        return
      }

      // For online payment, create Razorpay order
      const paymentOrderData = await paymentService.createPaymentOrder(order._id)

      // Initialize Razorpay payment
      await paymentService.initiatePayment(
        paymentOrderData,
        shippingAddress,
        async (paymentResponse) => {
          try {
            setIsLoading(true) // Show loading during verification

            // Verify payment
            const verificationData = {
              ...paymentResponse,
              orderId: order._id,
            }

            await paymentService.verifyPayment(verificationData)

            // Clear cart and navigate to success
            localStorage.removeItem("cart")
            window.dispatchEvent(new Event("cartUpdated"))
            navigate(`/order-success/${order._id}`)
          } catch (error) {
            console.error("Payment verification failed:", error)
            setIsLoading(false)
            const errorMessage = error.message || "Payment verification failed. Please contact support if the amount was deducted."
            alert(errorMessage)
            // Optionally navigate to order details page to check status
            // navigate(`/orders/${order._id}`)
          }
        },
        (error) => {
          console.error("Payment failed:", error)
          setIsLoading(false)
          const errorMessage = error.message || "Payment was cancelled or failed. Please try again."
          alert(errorMessage)
        },
      )
    } catch (error) {
      console.error("Order creation error:", error)
      alert(`Failed to place order: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart before proceeding to checkout.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>Home</span>
            <span>/</span>
            <span>Shopping Cart</span>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Details</h2>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Ex. John"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Ex. Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Enter Company Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter Email Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    placeholder="Enter Street Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    value={shippingAddress.city}
                    type="text"
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    value={shippingAddress.state}
                    type="text"
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Enter State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="Enter Zip Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter Phone Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <button
                  onClick={nextStep}
                  className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 transition-colors font-medium"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>

                <div className="space-y-4 mb-6">
                  {/* Razorpay handles card, UPI and wallet payments securely. */}
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === "Online"}
                      onChange={() => setPaymentMethod("Online")}
                      className="mr-4 text-green-600"
                    />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 block">Razorpay</span>
                        <span className="text-sm text-gray-500">Cards, UPI and wallets available at payment</span>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4 text-green-600"
                    />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center mr-3">
                        <Truck className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Cash On Delivery</span>
                    </div>
                  </label>

                </div>

                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 transition-colors font-medium"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </p>
                    {shippingAddress.companyName && <p className="text-gray-600">{shippingAddress.companyName}</p>}
                    <p className="text-gray-600">{shippingAddress.street}</p>
                    <p className="text-gray-600">
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-600">{shippingAddress.country}</p>
                    <p className="text-gray-600">{shippingAddress.email}</p>
                    <p className="text-gray-600">{shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {paymentMethod === "Online" ? "Razorpay" : "Cash On Delivery"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex-1 bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : "Confirm Payment"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">
                    {cartItems.reduce((count, item) => count + (Number(item.quantity) || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Total</span>
                  <span className="font-medium">₹{orderTotals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{orderTotals.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">₹{orderTotals.tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{payableTotal.toFixed(2)}</span>
                </div>
              </div>

              {currentStep === 1 && (
                <button
                  onClick={nextStep}
                  className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 transition-colors font-medium"
                >
                  Proceed to Payment
                </button>
              )}

              {currentStep === 2 && (
                <button
                  onClick={nextStep}
                  disabled={isLoading}
                  className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 transition-colors font-medium disabled:opacity-50"
                >
                  Continue to Review
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Shipping</h4>
              <p className="text-sm text-gray-600">Shipping charges are shown in your order summary.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Flexible Payment</h4>
              <p className="text-sm text-gray-600">Multiple secure payment options</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Customer Support</h4>
              <p className="text-sm text-gray-600">Contact us if you need help with your order.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help with Your Order?</h3>
              <p className="text-gray-600">Our support team is available to assist you with any questions</p>
            </div>
            <WhatsAppInlineButton
              departmentId="support"
              message="Hi! I need help with my checkout process."
              variant="primary"
              size="md"
              showIcon={true}
              showLabel={true}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
