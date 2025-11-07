// src/pages/NgoDashboard.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const NgoDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>NGO Dashboard</h1>
      <p>Welcome, {user ? user.name : 'NGO Member'}!</p>
      <p>Here you can view approved item requests and manage your profile.</p>
    </div>
  );
};

export default NgoDashboard;