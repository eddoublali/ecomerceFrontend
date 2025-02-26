import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Retrieve stored token and user data from localStorage
  const storedToken = localStorage.getItem("site") || "";
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

  // Function to handle login
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

      if (!response.ok) {
        throw new Error(res.message || "Login failed");
      }

      const userData = {
        _id: res._id,
        email: res.email,
        username: res.username,
        name: res.name,
        address: res.address,
        isAdmin: res.isAdmin || false,
        createdAt: res.createdAt,
      };

      setUser(userData);
      setToken(res.token);

      // Store token and user data in localStorage
      localStorage.setItem("site", res.token);
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setUser(null);
      setToken("");
      localStorage.removeItem("site");
      localStorage.removeItem("user");
      throw err;
    }
  };

  // Function to handle logout
  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("user");
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
        isAuthenticated: Boolean(user && token),
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
