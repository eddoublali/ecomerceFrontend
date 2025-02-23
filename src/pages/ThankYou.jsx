import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
        <p className="text-lg text-gray-600">
          Your order has been successfully placed.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            We'll send you an email confirmation with your order details and tracking information shortly.
          </p>
          <p className="text-sm text-gray-600">
            Your order will be processed and shipped as soon as possible.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/orders"
            className="block w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            View My Orders
          </Link>
          
          <Link
            to="/"
            className="block w-full bg-white text-black border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}