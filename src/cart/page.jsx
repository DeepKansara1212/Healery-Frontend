"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Minus, Plus, ShoppingBag, Shield, Truck, RotateCcw, X } from "lucide-react"

const CartPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      try {
        const cartData = localStorage.getItem("cart")
        const cart = cartData ? JSON.parse(cartData) : []
        // Ensure cart is always an array
        setCartItems(Array.isArray(cart) ? cart : [])
      } catch (error) {
        console.error("Error loading cart:", error)
        setCartItems([])
      }
      setIsLoading(false)
    }

    loadCart()

    // Listen for cart updates
    const handleCartUpdate = () => loadCart()
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    if (Array.isArray(cartItems)) {
      const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      setCartItems(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  const removeItem = (id) => {
    if (Array.isArray(cartItems)) {
      const updatedCart = cartItems.filter((item) => item.id !== id)
      setCartItems(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.setItem("cart", JSON.stringify([]))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock promo codes
    const promoCodes = {
      WELCOME10: { discount: 0.1, type: "percentage", description: "10% off your order" },
      HERBAL20: { discount: 0.2, type: "percentage", description: "20% off herbal products" },
      FREESHIP: { discount: 9.99, type: "fixed", description: "Free shipping" },
    }

    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...promoCodes[promoCode.toUpperCase()],
      })
    }

    setIsApplyingPromo(false)
  }

  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => {
        const price = Number.parseFloat(item.price) || 0
        const quantity = Number.parseInt(item.quantity) || 0
        return total + price * quantity
      }, 0)
    : 0

  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? subtotal * appliedPromo.discount
      : appliedPromo.discount
    : 0
  const discountedSubtotal = subtotal - promoDiscount
  const shipping = discountedSubtotal > 50 ? 0 : 9.99
  const tax = discountedSubtotal * 0.08
  const total = discountedSubtotal + shipping + tax

  const handleContinueShopping = () => {
    navigate("/products")
  }

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }
    navigate("/checkout")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Loading your cart...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>Home</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-yellow-400 px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 font-semibold text-gray-900">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Subtotal</div>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="px-6 py-6">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-6 flex items-center gap-4">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">Indoor Plant</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <span className="font-semibold text-gray-900">${item.price}</span>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-2 text-center">
                          <span className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="px-6 py-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700">Coupon Code</span>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={isApplyingPromo || !promoCode.trim()}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Apply Coupon
                    </button>
                  </div>
                  <button
                    onClick={clearCart}
                    className="text-gray-600 hover:text-red-600 font-medium transition-colors"
                  >
                    Clear Shopping Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span className="font-semibold">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span className="font-semibold">-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-600">Free shipping for order above $50</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Flexible Payment</h3>
              <p className="text-sm text-gray-600">Multiple secure payment options</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">24×7 Support</h3>
              <p className="text-sm text-gray-600">We support online all days.</p>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-gray-100 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Newsletter</h2>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Subscribe to Our Newsletter to
            <br />
            Get Updates on Our Latest Offers
          </h3>
          <p className="text-gray-600 mb-8">Get 25% off on your first order just by subscribing to our newsletter</p>

          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter Email Address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CartPage
