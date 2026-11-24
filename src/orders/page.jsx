"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import {
  Package,
  Eye,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  MapPin,
  Navigation,
  AlertCircle,
} from "lucide-react"
import orderService from "../services/orderService"
import shippingService from "../services/shippingService"
import { auth } from "../utils/api"
import WhatsAppInlineButton from "../components/WhatsAppInlineButton"

export default function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [trackingData, setTrackingData] = useState({})
  const [trackingLoading, setTrackingLoading] = useState({})

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate("/signin")
      return
    }

    fetchOrders()
  }, [currentPage, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getMyOrders(currentPage, 10)
      setOrders(response.orders || [])
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTrackOrder = async (orderId) => {
    if (trackingLoading[orderId]) return

    setTrackingLoading((prev) => ({ ...prev, [orderId]: true }))

    try {
      const tracking = await shippingService.trackShipment(orderId)
      setTrackingData((prev) => ({ ...prev, [orderId]: tracking }))
    } catch (error) {
      console.error("Error tracking order:", error)
      alert(`Failed to track order: ${error.message}`)
    } finally {
      setTrackingLoading((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "Processing":
        return <Package className="w-4 h-4 text-blue-600" />
      case "Shipped":
        return <Truck className="w-4 h-4 text-purple-600" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getShippingStatusIcon = (status) => {
    switch (status) {
      case "Not Shipped":
        return <Package className="w-4 h-4 text-gray-600" />
      case "Shipped":
        return <Truck className="w-4 h-4 text-blue-600" />
      case "In Transit":
        return <Navigation className="w-4 h-4 text-purple-600" />
      case "Out for Delivery":
        return <MapPin className="w-4 h-4 text-orange-600" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "RTO":
      case "Lost":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const getShippingStatusColor = (status) => {
    switch (status) {
      case "Not Shipped":
        return "bg-gray-100 text-gray-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "In Transit":
        return "bg-purple-100 text-purple-800"
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "RTO":
      case "Lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-plant-cream">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-plant-cream">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Orders</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-plant-cream">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-plant-primary mb-2">My Orders</h1>
            <p className="text-plant-secondary">Track and manage your orders</p>
          </div>
          <WhatsAppInlineButton
            departmentId="support"
            message="Hi! I need help with my order."
            variant="outline"
            size="md"
            showIcon={true}
            showLabel={true}
          />
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-plant-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-plant-light" />
            </div>
            <h2 className="text-2xl font-semibold text-plant-primary mb-4">No Orders Yet</h2>
            <p className="text-plant-secondary mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-plant-accent text-white px-6 py-3 rounded-lg hover:bg-plant-accent/90 transition-colors font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl p-6 shadow-sm border border-plant-light/20">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-plant-primary">Order #{order.orderNumber}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        </span>
                        {order.paymentStatus && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                              order.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-800"
                                : order.paymentStatus === "Failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            <CreditCard className="w-3 h-3" />
                            {order.paymentStatus}
                          </span>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-plant-secondary">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Placed on {formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>
                            {order.paymentMethod === "Online"
                              ? "Online Payment"
                              : order.paymentMethod === "Card"
                                ? "Credit/Debit Card"
                                : "Cash on Delivery"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Shipping Information */}
                      {(order.shippingStatus || order.awbCode || order.courierPartner) && (
                        <div className="mt-4 p-3 bg-stone-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-stone-900">Shipping Information</h4>
                            {order.shippingStatus && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getShippingStatusColor(order.shippingStatus)}`}
                              >
                                {getShippingStatusIcon(order.shippingStatus)}
                                {order.shippingStatus}
                              </span>
                            )}
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-stone-600">
                            {order.awbCode && (
                              <div>
                                <span className="font-medium">AWB Code:</span> {order.awbCode}
                              </div>
                            )}
                            {order.courierPartner && (
                              <div>
                                <span className="font-medium">Courier:</span> {order.courierPartner}
                              </div>
                            )}
                            {order.estimatedDelivery && (
                              <div>
                                <span className="font-medium">Est. Delivery:</span>{" "}
                                {formatDate(order.estimatedDelivery)}
                              </div>
                            )}
                          </div>

                          {/* Track Order Button */}
                          {order.shipRocketShipmentId && (
                            <div className="mt-3 flex items-center gap-3">
                              <button
                                onClick={() => handleTrackOrder(order._id)}
                                disabled={trackingLoading[order._id]}
                                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm disabled:opacity-50"
                              >
                                {trackingLoading[order._id] ? (
                                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Navigation className="w-4 h-4" />
                                )}
                                {trackingLoading[order._id] ? "Tracking..." : "Track Package"}
                              </button>
                              <WhatsAppInlineButton
                                departmentId="support"
                                message={`Hi! I need help tracking my order #${order.orderNumber}.`}
                                variant="ghost"
                                size="sm"
                                showIcon={true}
                                showLabel={false}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tracking Details */}
                      {trackingData[order._id] && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Live Tracking</h4>
                          <div className="space-y-2 text-sm">
                            {trackingData[order._id].trackingData?.tracking_data?.shipment_track &&
                              trackingData[order._id].trackingData.tracking_data.shipment_track.map((track, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <p className="text-blue-900 font-medium">{track.current_status}</p>
                                    <p className="text-blue-700">{track.location}</p>
                                    <p className="text-blue-600 text-xs">{new Date(track.date).toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Order Items Preview */}
                      <div className="mt-4">
                        <div className="flex items-center gap-3">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <span className="text-sm text-plant-secondary">{item.name}</span>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <span className="text-sm text-plant-secondary">+{order.items.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Total & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-plant-primary">₹{order.totalAmount?.toFixed(2)}</p>
                        <p className="text-sm text-plant-secondary">
                          {order.items?.reduce((total, item) => total + item.quantity, 0)} items
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/order-success/${order._id}`)}
                        className="flex items-center gap-2 bg-plant-accent text-white px-4 py-2 rounded-lg hover:bg-plant-accent/90 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="px-3 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
