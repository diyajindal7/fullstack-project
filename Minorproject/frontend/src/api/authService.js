// src/api/authService.js

import API_BASE_URL from './apiClient';

// ---- LOGIN ----
export const apiLogin = async (email, password, userType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Login response:", data);
    
    // Store token and user in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data; // This should include token/user info from backend
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// ---- SIGNUP ----
export const apiSignUp = async (name, email, password, userType, documents = null) => {
  try {
    // Map userType to role for backend validator, backend will map role to user_type
    // Backend expects POST /api/users to create a user
    const body = { 
      name, 
      email, 
      password, 
      user_type: userType || 'individual'
    };
    
    // Add documents if NGO
    if (userType === 'ngo' && documents) {
      body.documents = documents;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Signup failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Signup response:", data);
    
    // After successful registration, user needs to login to get token
    // Optionally auto-login here
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};
