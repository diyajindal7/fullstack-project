import React, { createContext, useState, useEffect } from 'react';
import { apiLogin, apiSignUp } from '../api/authService'; 

// Make sure to export the context itself
export const AuthContext = createContext(null);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage on mount
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Restore user state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // login function now calls the apiService
  const login = async (email, password, userType) => {
    try {
      // Pass all arguments to the API function
      const responseData = await apiLogin(email, password, userType);
      
      // Token and user are already stored in localStorage by authService
      // Now update state with user data
      if (responseData.user) {
        setUser(responseData.user);
      } else {
        // Fallback: if user is not in response, use what's in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      
      return responseData; // Return response on success
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error; // Re-throw error to be caught by the page
    }
  };

  // signup function now calls the apiService
  const signup = async (name, email, password, userType) => {
    try {
      // Pass all arguments to the API function
      const responseData = await apiSignUp(name, email, password, userType);
      
      // Note: Signup doesn't return token, user needs to login after signup
      // But we can still update state if needed
      return responseData; // Return response on success
    } catch (error) {
      console.error("Sign up failed:", error.message);
      throw error; // Re-throw error
    }
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // The value provided by the context
  const value = {
    user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

