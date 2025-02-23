import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, loading, isAuthenticated} = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    // Fetch dashboard statistics
    // Replace with your actual API calls
    const fetchDashboardStats = async () => {
      try {
        // Simulate API call
        setStats({
          totalUsers: 150,
          totalProducts: 45,
          totalOrders: 289,
          totalRevenue: 15420,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    if (user?.isAdmin) {
      fetchDashboardStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
     

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-green-500"
        />
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-purple-500"
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-yellow-500"
        />
        
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-600">New order #1234</p>
            <p className="text-xs text-gray-400">2 minutes ago</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-600">User John Doe registered</p>
            <p className="text-xs text-gray-400">15 minutes ago</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-600">Product "Gaming Chair" updated</p>
            <p className="text-xs text-gray-400">1 hour ago</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/products/add')}
            className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            Add New Product
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            View Recent Orders
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            Manage Users
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;