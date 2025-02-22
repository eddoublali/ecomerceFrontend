import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Plus, Minus } from "lucide-react";

export default function Orders() {
  const { cart, setCart, currency, delivery_free } = useContext(ShopContext);

  // Cart manipulation functions
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + delivery_free;

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
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-md overflow-hidden">
                  <img 
                    src={item.image[0]} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="font-medium">{currency}{item.price.toFixed(2)}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
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
                  <span className="font-medium">{currency}{delivery_free.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{currency}{total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}