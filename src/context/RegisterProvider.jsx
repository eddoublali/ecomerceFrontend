import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterContext = createContext();

const RegisterProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const RegisterAction = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      console.log('Registration response:', res);

      if (!response.ok) {
        throw new Error(res.message || 'Registration failed');
      }

      // Store user data from registration response
      const userData = {
        _id: res._id,
        email: res.email,
        username: res.username,
        isAdmin: res.isAdmin || false,
        createdAt: res.createdAt,
      };

      // Set user data and token
      setUser(userData);
      setToken(res.token);
      localStorage.setItem("site", res.token);

      // Navigate to the login page after successful registration
      navigate("/login");

    } catch (err) {
      console.error('Registration error:', err);
      setUser(null);
      setToken("");
      localStorage.removeItem("site");
      alert(err.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <RegisterContext.Provider value={{ RegisterAction }}>
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterProvider;

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }
  return context;
};
