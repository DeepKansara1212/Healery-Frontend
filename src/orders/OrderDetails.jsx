import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import orderService from "../services/orderService";
import TrackOrder from "./TrackOrder";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

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
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading order details</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Order details section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order #{order.orderNumber}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Order Information</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-gray-500">Order Date</dt>
                <dd className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</dd>
                
                <dt className="text-gray-500">Status</dt>
                <dd className="text-gray-900">{order.orderStatus}</dd>
                
                <dt className="text-gray-500">Payment Method</dt>
                <dd className="text-gray-900">{order.paymentMethod}</dd>
                
                <dt className="text-gray-500">Payment Status</dt>
                <dd className="text-gray-900">{order.paymentStatus}</dd>
              </dl>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
              <address className="text-sm text-gray-500 not-italic">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </address>
            </div>
          </div>
        </div>
        
        {/* Order items */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <th colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Subtotal</th>
                <td className="px-6 py-3 text-sm text-gray-900">₹{order.itemsPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Shipping</th>
                <td className="px-6 py-3 text-sm text-gray-900">₹{order.shippingPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Tax</th>
                <td className="px-6 py-3 text-sm text-gray-900">₹{order.taxPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-900">Total</th>
                <td className="px-6 py-3 text-sm font-bold text-gray-900">₹{order.totalPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Tracking information */}
        {order.shipRocketOrderId && (
          <TrackOrder orderId={order._id} />
        )}
      </div>
    </div>
  );
}