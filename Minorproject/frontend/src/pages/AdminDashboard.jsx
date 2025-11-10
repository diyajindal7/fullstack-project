// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import API_BASE_URL from '../api/apiClient';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  async function fetchAdminStats() {
    try {
      setLoadingStats(true);
      setStatsError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/admins/stats`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (!res.ok) throw new Error("Could not fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStatsError(err.message);
    } finally {
      setLoadingStats(false);
    }
  }

  return (
    <div className="admin-dashboard-container" data-aos="fade-up">

      <h1 className="admin-dashboard-title" data-aos="zoom-in">
        Admin Dashboard
      </h1>
      <p className="admin-dashboard-welcome" data-aos="fade-up">
        Welcome, <strong>{user?.name}</strong> 👋 Manage the platform efficiently.
      </p>

      {/* Action Cards */}
      <div className="admin-dashboard-grid">
        
        <div className="admin-card" data-aos="zoom-in" onClick={() => navigate('/admin/categories')}>
          <h3>Manage Categories</h3>
          <p>Create, edit and organize item categories.</p>
        </div>

        <div className="admin-card" data-aos="zoom-in" onClick={() => navigate('/admin/users')}>
          <h3>Manage Donators</h3>
          <p>View and moderate donor accounts.</p>
        </div>

        <div className="admin-card" data-aos="zoom-in" onClick={() => navigate('/admin/ngos')}>
          <h3>Manage NGOs</h3>
          <p>Handle requester organizations.</p>
        </div>

        <div className="admin-card" data-aos="zoom-in" onClick={() => navigate('/admin/ngo-verification')}>
          <h3>Verify NGOs</h3>
          <p>Approve or reject NGO applications.</p>
        </div>

        <div className="admin-card" data-aos="zoom-in" onClick={() => navigate('/admin/user-reports')}>
          <h3>User Reports</h3>
          <p>Review reported issues.</p>
        </div>

        <div className="admin-card" data-aos="zoom-in" onClick={fetchAdminStats}>
          <h3>View Platform Stats</h3>
          <p>See usage insights.</p>
        </div>

      </div>

      {loadingStats && <p>Loading stats...</p>}
      {statsError && <p style={{ color: 'red' }}>{statsError}</p>}

      {stats && (
        <div className="admin-stats-box" data-aos="fade-up">
          <h3>📊 Platform Stats</h3>
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
