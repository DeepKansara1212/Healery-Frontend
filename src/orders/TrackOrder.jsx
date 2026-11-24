import { useState, useEffect } from "react";
import { Truck, Package, CheckCircle, AlertCircle } from "lucide-react";
import shippingService from "../services/shippingService";

export default function TrackOrder({ orderId }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchTrackingData();
    }
  }, [orderId]);

  const fetchTrackingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shippingService.trackShipment(orderId);
      setTrackingData(data);
    } catch (err) {
      setError(err.message || "Failed to load tracking information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading tracking information</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Package className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Tracking information not available yet</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Your order is being processed. Tracking information will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine current status and steps
  const statusMap = {
    "Pending": 0,
    "Shipped": 1,
    "In Transit": 2,
    "Out for Delivery": 3,
    "Delivered": 4
  };

  const currentStatusIndex = statusMap[trackingData.shippingStatus] || 0;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Shipment Tracking</h2>
      
      {/* Shipment details */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Courier</p>
          <p className="font-medium">{trackingData.courierPartner || "Not assigned yet"}</p>
        </div>
        <div>
          <p className="text-gray-500">Tracking Number</p>
          <p className="font-medium">{trackingData.awbCode || "Not available yet"}</p>
        </div>
        <div>
          <p className="text-gray-500">Estimated Delivery</p>
          <p className="font-medium">
            {trackingData.estimatedDelivery 
              ? new Date(trackingData.estimatedDelivery).toLocaleDateString() 
              : "Not available yet"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <p className="font-medium">{trackingData.shippingStatus || "Processing"}</p>
        </div>
      </div>
      
      {/* Tracking timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Order Placed */}
        <div className="relative flex items-start mb-6">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            currentStatusIndex >= 0 ? "bg-green-100" : "bg-gray-100"
          }`}>
            <Package className={`h-5 w-5 ${
              currentStatusIndex >= 0 ? "text-green-600" : "text-gray-400"
            }`} />
          </div>
          <div className="ml-4">
            <h3 className={`text-sm font-medium ${
              currentStatusIndex >= 0 ? "text-gray-900" : "text-gray-500"
            }`}>Order Placed</h3>
            <p className="text-xs text-gray-500">Your order has been placed successfully</p>
          </div>
        </div>
        
        {/* Shipped */}
        <div className="relative flex items-start mb-6">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            currentStatusIndex >= 1 ? "bg-green-100" : "bg-gray-100"
          }`}>
            <Truck className={`h-5 w-5 ${
              currentStatusIndex >= 1 ? "text-green-600" : "text-gray-400"
            }`} />
          </div>
          <div className="ml-4">
            <h3 className={`text-sm font-medium ${
              currentStatusIndex >= 1 ? "text-gray-900" : "text-gray-500"
            }`}>Shipped</h3>
            <p className="text-xs text-gray-500">Your order has been shipped</p>
          </div>
        </div>
        
        {/* In Transit */}
        <div className="relative flex items-start mb-6">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            currentStatusIndex >= 2 ? "bg-green-100" : "bg-gray-100"
          }`}>
            <Truck className={`h-5 w-5 ${
              currentStatusIndex >= 2 ? "text-green-600" : "text-gray-400"
            }`} />
          </div>
          <div className="ml-4">
            <h3 className={`text-sm font-medium ${
              currentStatusIndex >= 2 ? "text-gray-900" : "text-gray-500"
            }`}>In Transit</h3>
            <p className="text-xs text-gray-500">Your order is on the way</p>
          </div>
        </div>
        
        {/* Out for Delivery */}
        <div className="relative flex items-start mb-6">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            currentStatusIndex >= 3 ? "bg-green-100" : "bg-gray-100"
          }`}>
            <Truck className={`h-5 w-5 ${
              currentStatusIndex >= 3 ? "text-green-600" : "text-gray-400"
            }`} />
          </div>
          <div className="ml-4">
            <h3 className={`text-sm font-medium ${
              currentStatusIndex >= 3 ? "text-gray-900" : "text-gray-500"
            }`}>Out for Delivery</h3>
            <p className="text-xs text-gray-500">Your order is out for delivery</p>
          </div>
        </div>
        
        {/* Delivered */}
        <div className="relative flex items-start">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            currentStatusIndex >= 4 ? "bg-green-100" : "bg-gray-100"
          }`}>
            <CheckCircle className={`h-5 w-5 ${
              currentStatusIndex >= 4 ? "text-green-600" : "text-gray-400"
            }`} />
          </div>
          <div className="ml-4">
            <h3 className={`text-sm font-medium ${
              currentStatusIndex >= 4 ? "text-gray-900" : "text-gray-500"
            }`}>Delivered</h3>
            <p className="text-xs text-gray-500">Your order has been delivered</p>
          </div>
        </div>
      </div>
      
      {/* Tracking history */}
      {trackingData.trackingData && trackingData.trackingData.tracking_data && trackingData.trackingData.tracking_data.shipment_track && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tracking History</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trackingData.trackingData.tracking_data.shipment_track.map((track, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(track.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {track.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {track.location || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}