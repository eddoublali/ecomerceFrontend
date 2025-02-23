import { Routes, Route, useLocation } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Navbar from "./components/Navebar";
import Footer from "./components/Footer";
import AdminLayout from "./components/layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import RegisterProvider from "./context/RegisterProvider";

// Import admin pages
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AddProduct from "./pages/admin/AddProduct";
import PlaceOrder from "./pages/PlaceOrder";
import OrdersProvider from "./context/OrdersProvider";
import ThankYou from "./pages/ThankYou";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/dashboard';

  return (
    <AuthProvider>
      <RegisterProvider>
        <OrdersProvider>
          <div className="app">
            {!isAdminRoute && <Navbar />}
            
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/product/:id" element={<Products />} />

              {/* Protected user routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/orders" element={<Orders />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/thankyou" element={<ThankYou />} />
              </Route>

              {/* Protected admin routes - with AdminLayout */}
              <Route element={<AdminRoute />}>
                <Route
                  path="/dashboard"
                  element={
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminLayout>
                      <AdminOrders />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminLayout>
                      <AdminProducts />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/products/add"
                  element={
                    <AdminLayout>
                      <AddProduct />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  }
                />
              </Route>
            </Routes>
            
            {!isAdminRoute && <Footer />}
          </div>
        </OrdersProvider>
      </RegisterProvider>
    </AuthProvider>
  );
}

export default App;