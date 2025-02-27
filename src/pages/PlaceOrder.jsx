import { useContext, useState } from "react";
import { useOrders } from "../context/OrdersProvider";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthProvider";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlaceOrder() {
  const { cart, currency, setCart } = useContext(ShopContext);
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    address: user?.address || "",
  });

  // Calculate order totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id || cart.length === 0) {
      setError("Unable to place order. Please check your login status and cart.");
      return;
    }

    if (!formData.name || !formData.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totalAmount: total,
        shippingDetails: {
          name: formData.name,
          address: formData.address
        }
      };

      const response = await createOrder(orderData);

      if (response && response.status === 201) {
        setCart([]);
        navigate('/thankyou');
      } else {
        throw new Error(response?.message || 'Order could not be processed');
      }
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
      console.error("Order error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please log in to continue</h2>
          <p className="text-gray-500">You need to be logged in to place an order.</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Add some items to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Place Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <form id="order-form" onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    required
                  />
                </div>
              </div>
            </form>

            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order Items</h2>
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 py-4 border-b last:border-b-0">
                  <div className="w-20 h-20 rounded-md overflow-hidden">
                    <img 
                      src={`https://fastshipbackend.onrender.com${item.image[0]}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category.name}</p>
                    <div className="mt-2 flex justify-between">
                      <span>Quantity: {item.quantity}</span>
                      <span className="font-medium">
                        {currency}{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-4 sticky top-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-medium">{currency}{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{currency}{total.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                form="order-form"
                disabled={isLoading || cart.length === 0}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </span>
                ) : (
                  `Place Order • ${currency}${total.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}