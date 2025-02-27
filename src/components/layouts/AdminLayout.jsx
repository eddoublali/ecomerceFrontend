import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Users, ShoppingCart, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };
  const { logOut } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>
        
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/dashboard') 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/orders') 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/products') 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products/add"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/products/add') 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Plus className="w-5 h-5 mr-3" />
                Add Product
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/users') 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Logout button container */}
        <div className="p-4 border-t">
          <button
            onClick={logOut}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;