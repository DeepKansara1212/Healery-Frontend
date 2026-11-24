"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { CheckCircle, Truck, CreditCard, Shield } from "lucide-react"
import orderService from "../../services/orderService"

export default function OrderSuccessPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const orderData = await orderService.getOrderById(id)
        setOrder(orderData)
      } catch (error) {
        console.error("Error fetching order:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id])

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert("Receipt download functionality would be implemented here")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">
              {error || "The order you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition-colors font-medium"
            >
              View My Orders
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Completed</h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>Home</span>
            <span>/</span>
            <span className="text-gray-900">Order Completed</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your order is completed!</h2>
          <p className="text-gray-600">Thank you. Your Order has been received.</p>
        </div>

        <div className="bg-yellow-400 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-800 mb-1">Order ID</p>
              <p className="font-bold text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 mb-1">Payment Method</p>
              <p className="font-bold text-gray-900">
                {order.paymentMethod === "Online" ? "Razorpay" : order.paymentMethod === "COD" ? "COD" : order.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-800 mb-1">Transaction ID</p>
              <p className="font-bold text-gray-900">{order.razorpayPaymentId || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 mb-1">Estimated Delivery Date</p>
              <p className="font-bold text-gray-900">
                {order.estimatedDelivery
                  ? new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                  : "To be confirmed"}
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={handleDownloadReceipt}
              className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-900 transition-colors font-medium"
            >
              Download Invoice
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Products</h4>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-600">Indoor Plant</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">Sub Total</p>
                    <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₹{(order.shippingCost || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes</span>
              <span className="font-medium">₹{(order.tax || 0).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-red-600">-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Free Shipping</h4>
              <p className="text-sm text-gray-600">Shipping charges are included in your order total.</p>
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
              <h4 className="font-semibold text-gray-900">24x7 Support</h4>
              <p className="text-sm text-gray-600">We support online all days.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
