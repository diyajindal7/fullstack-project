// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button'; // 2. Import your Button
import API_BASE_URL from '../api/apiClient';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // 3. Get the navigate function

  // Style for the button wrapper to control width
  const buttonWrapperStyle = {
    maxWidth: '400px',
    marginBottom: '1rem',
  };

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState('');

  async function fetchAdminStats() {
    try {
      setLoadingStats(true);
      setStatsError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/admins/stats`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed: ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setStatsError(e.message || 'Failed to fetch stats');
    } finally {
      setLoadingStats(false);
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Administrator {user ? user.name : ''}!</p>
      
      {/* 4. Use Buttons with onClick to navigate */}
      <div style={buttonWrapperStyle}>
        <Button variant="primary" onClick={() => navigate('/admin/categories')}>
          Manage Categories
        </Button>
      </div>

      <div style={buttonWrapperStyle}>
        <Button variant="primary" onClick={() => navigate('/admin/users')}>
          Manage Users (Donators)
        </Button>
      </div>

      <div style={buttonWrapperStyle}>
        <Button variant="primary" onClick={() => navigate('/admin/ngos')}>
          Manage NGOs (Requesters)
        </Button>
      </div>

      <div style={buttonWrapperStyle}>
        <Button variant="primary" onClick={() => navigate('/admin/ngo-verification')}>
          Verify NGOs
        </Button>
      </div>

      <div style={buttonWrapperStyle}>
        <Button variant="primary" onClick={() => navigate('/admin/user-reports')}>
          User Reports
        </Button>
      </div>

      <div style={buttonWrapperStyle}>
        <Button variant="secondary" onClick={() => navigate('/admin/stats')}>
          View Platform Stats
        </Button>
      </div>

      {loadingStats && <p>Loading stats...</p>}
      {statsError && <p style={{ color: 'red' }}>{statsError}</p>}
      {stats && stats.success && (
        <div>
          <h3>Stats</h3>
          <ul>
            <li>Total Users: {stats.users?.total}</li>
            <li>Total Items: {stats.items?.total}</li>
            <li>Total Requests: {stats.requests?.total}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;