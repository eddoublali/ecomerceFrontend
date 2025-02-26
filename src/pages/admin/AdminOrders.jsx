import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useOrders } from "../../context/OrdersProvider";
import { ShoppingBag, Clock, CheckCircle, XCircle, Truck, RefreshCw } from "lucide-react";

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    processing: {
      color: "bg-blue-100 text-blue-800",
      icon: RefreshCw,
    },
    shipped: {
      color: "bg-purple-100 text-purple-800",
      icon: Truck,
    },
    delivered: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdminOrders = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const { orders, isLoading, error, getOrders } = useOrders();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }

    if (user && !user.isAdmin) {
      navigate("/");
    }

    if (user?.isAdmin) {
      getOrders();
    }
  }, [loading, isAuthenticated, navigate, user, getOrders]);

  // Filter orders by status
  useEffect(() => {
    if (orders) {
      if (selectedStatus) {
        setDisplayedOrders(orders.filter(order => 
          order.status.toLowerCase() === selectedStatus.toLowerCase()
        ));
      } else {
        setDisplayedOrders(orders);
      }
    }
  }, [orders, selectedStatus]);

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const token = localStorage.getItem("site");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      // Update local orders state
      getOrders();
      
      // Close modal
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
      setUpdateError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // if (loading || isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2" />
          Orders Management
        </h1>
        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedOrders && displayedOrders.length > 0 ? (
                displayedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.shippingDetails?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status || "pending"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Order #{selectedOrder._id.slice(-6)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  &times;
                </button>
              </div>

              {updateError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                  {updateError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                  <p className="text-sm"><span className="font-medium">Status:</span> <OrderStatusBadge status={selectedOrder.status || "pending"} /></p>
                  <p className="text-sm mt-2"><span className="font-medium">Date:</span> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "N/A"}</p>
                  <p className="text-sm mt-2"><span className="font-medium">Total Amount:</span> ${selectedOrder.totalAmount ? selectedOrder.totalAmount.toFixed(2) : "0.00"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.shippingDetails?.name || "N/A"}</p>
                  <p className="text-sm mt-2"><span className="font-medium">Email:</span> {selectedOrder.user?.email || "N/A"}</p>
                  <p className="text-sm mt-2"><span className="font-medium">Shipping Address:</span> {selectedOrder.shippingDetails?.address || "N/A"}</p>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
              <div className="border rounded-md mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.products && selectedOrder.products.length > 0 ? (
                      selectedOrder.products.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.product?.name || "Unknown Product"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.price ? item.price.toFixed(2) : "0.00"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.total ? item.total.toFixed(2) : "0.00"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                      disabled={isUpdating || selectedOrder.status === status}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        selectedOrder.status === status
                          ? "bg-gray-100 text-gray-800 cursor-not-allowed"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;