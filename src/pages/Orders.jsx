import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { cart, currency } = useContext(ShopContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate order totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

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
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Review Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Delivery Details</h2>
              <div className="space-y-2">
                <p className="text-gray-600">Name: {user?.name}</p>
                <p className="text-gray-600">Address: {user?.address}</p>
              </div>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order Items</h2>
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 py-4 border-b last:border-b-0">
                  <div className="w-20 h-20 rounded-md overflow-hidden">
                    <img 
                      src={`http://localhost:3000${item.image[0]}`}
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

              <button
                onClick={() => navigate('/placeorder')}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout • {currency}{total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}