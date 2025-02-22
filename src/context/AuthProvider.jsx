import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const loginAction = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const res = await response.json();
      console.log('Login response:', res);
  
      if (!response.ok) {
        throw new Error(res.message || 'Login failed');
      }
  
      // Store user data from login response
      const userData = {
        _id: res._id,
        email: res.email,
        username: res.username,
        isAdmin: res.isAdmin || false,
        createdAt: res.createdAt
      };
  
      // Set user data and token
      setUser(userData);
      setToken(res.token);
      localStorage.setItem("site", res.token);
  
      // Route based on user role
      if (userData.isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/"); // Regular users go to the home page
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setUser(null);
      setToken("");
      localStorage.removeItem("site");
      alert(err.message || 'Failed to login. Please try again.');
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        loginAction, 
        logOut,
        isAdmin: user?.isAdmin || false,
        isAuthenticated: Boolean(user && token)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};