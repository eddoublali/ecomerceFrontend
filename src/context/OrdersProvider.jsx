import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";

const OrdersContext = createContext();

const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { token, user } = useAuth();

  const createOrder = async (orderData) => {
    setIsLoading(true);
    setError(null);

    try {
      const storedToken = localStorage.getItem("site") || token;
      
      if (!storedToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch("https://fastshipbackend.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setOrders(prevOrders => [...(prevOrders || []), data]);
      return { status: response.status, data };

    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const storedToken = localStorage.getItem("site") || token;
      
      if (!storedToken) {
        throw new Error('Authentication required');
      }

      // Use different endpoints for admin and regular users
      const endpoint = user?.isAdmin 
        ? "https://fastshipbackend.onrender.com/api/orders"
        : "https://fastshipbackend.onrender.com/api/orders/user";

      const response = await fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data);
      return data;

    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderById = async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
      const storedToken = localStorage.getItem("site") || token;
      
      if (!storedToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`https://fastshipbackend.onrender.com/api/orders/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch order');
      }

      return data;

    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearOrders = () => {
    setOrders(null);
    setError(null);
  };

  return (
    <OrdersContext.Provider 
      value={{ 
        orders,
        isLoading,
        error,
        createOrder,
        getOrders,
        getOrderById,
        clearOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export default OrdersProvider;