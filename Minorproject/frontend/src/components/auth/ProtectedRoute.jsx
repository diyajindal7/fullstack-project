import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // <-- 1. This path is now correct (../../)

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // 1. Check if user is logged in
  if (!user) {
    // If not, redirect to the login page
    return <Navigate to="/login" />;
  }

  // 2. Check if the user's role is allowed
  if (!allowedRoles.includes(user.user_type)) {
    // If not, redirect to the home page (or a "Not Authorized" page)
    return <Navigate to="/" />;
  }

  // 3. If everything is fine, show the page
  return children;
};

export default ProtectedRoute;
