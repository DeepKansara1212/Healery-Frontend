"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import {
  Settings,
  Package,
  CreditCard,
  Shield,
  User,
  ChevronRight,
  Camera,
  Pencil,
  CheckCircle,
  XCircle,
  Info,
  Check,
  Save,
  Clock,
  Truck,
  ShoppingBag,
  DollarSign,
  Trash2,
  AlertTriangle,
  Leaf,
  Eye,
  EyeOff,
  Plus,
  Edit3,
  ArrowRight,
  TrendingUp
} from "lucide-react"
import authService from "../services/authService"
import { auth } from "../utils/api"

// Password Manager Section
const PasswordManagerSection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match" });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      await authService.changePassword(currentPassword, newPassword);
      setMessage({ type: "success", text: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Password Manager</h2>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.type === "success" ? <CheckCircle className="inline w-4 h-4 mr-2" /> : <XCircle className="inline w-4 h-4 mr-2" />}
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Orders Section
const OrdersSection = ({ orders = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Order #{order._id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`text-sm px-3 py-1 rounded-full mt-2 md:mt-0 ${
                  order.status === "Delivered" ? "bg-green-100 text-green-800" :
                  order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                  order.status === "Shipped" ? "bg-purple-100 text-purple-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {order.status}
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.items?.length || 0} items</p>
                    <p className="text-lg font-bold">₹{order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Address Section
const AddressSection = ({ user, editForm, handleInputChange, handleSave }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Address</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={editForm.address?.street || ""}
              onChange={(e) => handleInputChange("address.street", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter street address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={editForm.address?.city || ""}
              onChange={(e) => handleInputChange("address.city", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={editForm.address?.state || ""}
              onChange={(e) => handleInputChange("address.state", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter state"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              value={editForm.address?.zipCode || ""}
              onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter ZIP code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={editForm.address?.country || ""}
              onChange={(e) => handleInputChange("address.country", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter country"
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

// Payment Method Section
const PaymentMethodSection = () => {
  const [cards, setCards] = useState([
    {
      id: "card1",
      type: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    }
  ]);
  
  const [showAddCard, setShowAddCard] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
      
      <div className="space-y-4">
        {cards.map((card) => (
          <div key={card.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                <span className="font-bold text-blue-800">{card.type}</span>
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• {card.last4}</p>
                <p className="text-sm text-gray-500">Expires {card.expMonth}/{card.expYear}</p>
              </div>
            </div>
            <div className="flex items-center">
              {card.isDefault && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-3">
                  Default
                </span>
              )}
              <button className="text-gray-400 hover:text-gray-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        
        {!showAddCard ? (
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Payment Method
          </button>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-3">Add New Card</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="defaultCard" className="mr-2" />
                <label htmlFor="defaultCard" className="text-sm text-gray-700">Set as default payment method</label>
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Account Settings Section Component
const AccountSettingsSection = ({
  user,
  editForm,
  handleInputChange,
  saveStatus,
  hasFormChanges,
  handleSave,
  handleCancel,
  saving,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <div
          className={`flex items-center gap-2 text-sm transition-all duration-300 ${saveStatus === "Saved successfully!"
              ? "text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
              : saveStatus === "Saving..."
                ? "text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200"
                : saveStatus === "Error saving changes"
                  ? "text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                  : saveStatus === "Changes cancelled"
                    ? "text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200"
                    : saveStatus === "No changes to save"
                      ? "text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
                      : "text-gray-500"
            }`}
        >
          {saveStatus === "Saved successfully!" ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : saveStatus === "Saving..." ? (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ) : saveStatus === "Error saving changes" ? (
            <XCircle className="w-4 h-4 text-red-600" />
          ) : saveStatus === "Changes cancelled" ? (
            <XCircle className="w-4 h-4 text-yellow-600" />
          ) : saveStatus === "No changes to save" ? (
            <Info className="w-4 h-4 text-gray-600" />
          ) : (
            <Info className="w-4 h-4" />
          )}
          <span>{saveStatus || "Make changes and click Save to update your profile"}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                value={editForm.firstName || user?.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                value={editForm.lastName || user?.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                value={editForm.email || user?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                placeholder="Enter your email"
              />
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={editForm.phone || user?.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={editForm.address?.street || user?.address?.street || ""}
                onChange={(e) => handleInputChange("address.street", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={editForm.address?.city || user?.address?.city || ""}
                onChange={(e) => handleInputChange("address.city", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={editForm.address?.state || user?.address?.state || ""}
                onChange={(e) => handleInputChange("address.state", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                value={editForm.address?.zipCode || user?.address?.zipCode || ""}
                onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter ZIP code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={editForm.address?.country || user?.address?.country || ""}
                onChange={(e) => handleInputChange("address.country", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={saving || !hasFormChanges()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasFormChanges()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Orders & Tracking Section Component
const OrdersTrackingSection = ({ orders, orderStats, navigate }) => {
  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "Processing":
        return <Package className="w-4 h-4 text-blue-500" />
      case "Shipped":
        return <Truck className="w-4 h-4 text-purple-500" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getOrderStatusColor = (status) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders & Tracking</h1>
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <span>View All Orders</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-emerald-700">{orderStats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(orderStats?.totalSpent || 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-purple-700">
                {(orderStats?.pendingOrders || 0) +
                  (orderStats?.processingOrders || 0) +
                  (orderStats?.shippedOrders || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        {orders?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getOrderStatusIcon(order.orderStatus)}
                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items?.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center"
                        >
                          <Package className="w-4 h-4 text-gray-600" />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-600">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-600">Tracking: </span>
                      <span className="text-sm font-medium text-emerald-600">{order.trackingNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Notifications Section Component
const NotificationsSection = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    orderUpdates: true,
    promotions: false,
    newsletters: true,
  })

  const handleNotificationChange = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Communication Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => handleNotificationChange("email", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-500">Receive updates via text message</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => handleNotificationChange("sms", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive browser notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => handleNotificationChange("push", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Notification Types</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Order Updates</h3>
                <p className="text-sm text-gray-500">Get notified about order status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.orderUpdates}
                  onChange={(e) => handleNotificationChange("orderUpdates", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Promotions & Offers</h3>
                <p className="text-sm text-gray-500">Receive special offers and discounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.promotions}
                  onChange={(e) => handleNotificationChange("promotions", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Newsletters</h3>
                <p className="text-sm text-gray-500">Receive our weekly newsletter</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.newsletters}
                  onChange={(e) => handleNotificationChange("newsletters", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Payments Section Component
const PaymentsSection = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "card", last4: "4242", brand: "Visa", expiry: "12/25", isDefault: true },
    { id: 2, type: "card", last4: "5555", brand: "Mastercard", expiry: "08/26", isDefault: false },
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Payment Method</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Payment Methods */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {method.brand} •••• {method.last4}
                    </h3>
                    <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">Default</span>
                  )}
                  <button className="text-gray-500 hover:text-gray-700">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Billing Address</h2>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Default Billing Address</h3>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Edit</button>
            </div>
            <p className="text-gray-600">
              123 Main Street
              <br />
              New York, NY 10001
              <br />
              United States
            </p>
          </div>
        </div>

        {/* Billing History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Order #HL1234567890</p>
                <p className="text-sm text-gray-500">December 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹99.99</p>
                <p className="text-sm text-green-600">Paid</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Order #HL1234567891</p>
                <p className="text-sm text-gray-500">December 10, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹149.99</p>
                <p className="text-sm text-green-600">Paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Security Section Component
const SecuritySection = ({ handleChangePassword, setShowDeleteModal, setShowDeactivateModal }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match")
      return
    }
    handleChangePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Security & Privacy</h1>

      <div className="space-y-8">
        {/* Change Password */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">SMS Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Enable
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                <p className="text-sm text-gray-500">Make your profile visible to other users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Data Sharing</h3>
                <p className="text-sm text-gray-500">Allow sharing of anonymized data for improvements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Account Actions</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Deactivate Account</h3>
                <button
                  onClick={() => setShowDeactivateModal(true)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Deactivate
                </button>
              </div>
              <p className="text-sm text-gray-500">Deactivating will suspend your account until you sign back in.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Delete Account</h3>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-500">Permanently delete your account and all of your content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal Components
const DeleteAccountModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to permanently delete your account? This action cannot be undone and will remove all
          your data, orders, and account information.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

const DeactivateAccountModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">Deactivate Account</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to deactivate your account? You can reactivate it anytime by signing back in.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  )
}

const PersonalInfoSection = ({ user, editForm, handleInputChange, handleSave }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={editForm.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={editForm.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={editForm.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your email"
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={editForm.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your phone number"
          />
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState("personal")
  const [editForm, setEditForm] = useState({})
  const [originalForm, setOriginalForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Your code that uses document or window
      if (!auth.isAuthenticated()) {
        navigate("/signin")
        return
      }
      loadProfileData()
    }
  }, [navigate])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const [profileResponse, ordersResponse] = await Promise.all([
        authService.getProfile(),
        authService.getProfileOrders(1, 5),
      ])

      if (profileResponse) {
        setProfileData(profileResponse)
        const formData = {
          firstName: profileResponse.user.firstName || "",
          lastName: profileResponse.user.lastName || "",
          email: profileResponse.user.email || "",
          phone: profileResponse.user.phone || "",
          address: {
            street: profileResponse.user.address?.street || "",
            city: profileResponse.user.address?.city || "",
            state: profileResponse.user.address?.state || "",
            zipCode: profileResponse.user.address?.zipCode || "",
            country: profileResponse.user.address?.country || "",
          },
        }
        setEditForm(formData)
        setOriginalForm(JSON.parse(JSON.stringify(formData))) // Deep copy
      }

      if (ordersResponse) {
        setRecentOrders(ordersResponse.orders || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Check if form has actual changes
  const hasFormChanges = () => {
    if (!originalForm || !editForm) return false

    return JSON.stringify(editForm) !== JSON.stringify(originalForm)
  }

  // Manual save function
  const handleSave = async () => {
    if (!hasFormChanges()) {
      setSaveStatus("No changes to save")
      setTimeout(() => setSaveStatus(""), 2000)
      return
    }

    try {
      setSaving(true)
      setSaveStatus("Saving...")
      const updatedUser = await authService.updateProfile(editForm)
      if (updatedUser) {
        setProfileData((prev) => ({
          ...prev,
          user: updatedUser,
        }))
        setOriginalForm(JSON.parse(JSON.stringify(editForm))) // Update original form
        setSaveStatus("Saved successfully!")
        setTimeout(() => setSaveStatus(""), 3000)
      }
    } catch (err) {
      setSaveStatus("Error saving changes")
      setTimeout(() => setSaveStatus(""), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Manual cancel function
  const handleCancel = () => {
    setEditForm(JSON.parse(JSON.stringify(originalForm))) // Reset to original
    setSaveStatus("Changes cancelled")
    setTimeout(() => setSaveStatus(""), 2000)
  }

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setEditForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleChangePassword = async (passwordData) => {
    try {
      setSaving(true)
      await authService.changePassword(passwordData)
      setSaveStatus("Password changed successfully!")
      setTimeout(() => setSaveStatus(""), 3000)
    } catch (err) {
      setSaveStatus("Error changing password")
      setTimeout(() => setSaveStatus(""), 3000)
    } finally {
      setSaving(false)
    }
  }

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "Processing":
        return <Package className="w-4 h-4 text-blue-500" />
      case "Shipped":
        return <Truck className="w-4 h-4 text-purple-500" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getOrderStatusColor = (status) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Error Loading Profile</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={loadProfileData}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">No Profile Data</h2>
          <p className="text-muted-foreground">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  const { user, orderStats } = profileData

  // Navigation items
const navigationItems = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "address", label: "Manage Address", icon: Truck },
  { id: "payment", label: "Payment Method", icon: CreditCard },
  { id: "password", label: "Password Manager", icon: Shield },
  { id: "logout", label: "Logout", icon: ArrowRight },
]

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalInfoSection
            user={profileData?.user}
            editForm={editForm}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
          />
        )
      case "orders":
        return <OrdersSection orders={recentOrders} />
      case "address":
        return (
          <AddressSection
            user={profileData?.user}
            editForm={editForm}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
          />
        )
      case "payment":
        return <PaymentMethodSection />
      case "password":
        return <PasswordManagerSection handleChangePassword={handleChangePassword} />
      case "logout":
        // Handle logout
        authService.logout()
        navigate("/signin")
        return null
      default:
        return (
          <PersonalInfoSection
            user={profileData?.user}
            editForm={editForm}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Account</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProfilePage
