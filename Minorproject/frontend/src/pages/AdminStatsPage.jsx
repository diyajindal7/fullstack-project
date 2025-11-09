// src/pages/AdminStatsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import API_BASE_URL from '../api/apiClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/admins/stats`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (!res.ok) {
        throw new Error(`Failed: ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setError(e.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Loading statistics...</h2></div>;
  }

  if (error) {
    return <div style={{ padding: '2rem' }}><p style={{ color: 'red' }}>{error}</p></div>;
  }

  if (!stats || !stats.success) {
    return <div style={{ padding: '2rem' }}><p>No statistics available.</p></div>;
  }

  // Prepare data for charts
  const userRoleData = stats.users?.byRole?.map(role => ({
    name: role.role || 'Unknown',
    value: role.count || 0
  })) || [];

  const requestStatusData = stats.requests?.byStatus?.map(status => ({
    name: status.status || 'Unknown',
    value: status.count || 0
  })) || [];

  const overviewData = [
    { name: 'Users', value: stats.users?.total || 0 },
    { name: 'Items', value: stats.items?.total || 0 },
    { name: 'Requests', value: stats.requests?.total || 0 }
  ];

  const containerStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    marginBottom: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Platform Statistics</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Visual overview of platform metrics and trends
      </p>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ ...containerStyle, textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Users</h3>
          <h2 style={{ margin: 0, color: '#0088FE', fontSize: '2.5rem' }}>{stats.users?.total || 0}</h2>
        </div>
        <div style={{ ...containerStyle, textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Items</h3>
          <h2 style={{ margin: 0, color: '#00C49F', fontSize: '2.5rem' }}>{stats.items?.total || 0}</h2>
        </div>
        <div style={{ ...containerStyle, textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Requests</h3>
          <h2 style={{ margin: 0, color: '#FFBB28', fontSize: '2.5rem' }}>{stats.requests?.total || 0}</h2>
        </div>
      </div>

      {/* User Role Distribution Pie Chart */}
      {userRoleData.length > 0 && (
        <div style={containerStyle}>
          <h2 style={{ marginBottom: '1rem' }}>User Distribution by Role</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Request Status Distribution Bar Chart */}
      {requestStatusData.length > 0 && (
        <div style={containerStyle}>
          <h2 style={{ marginBottom: '1rem' }}>Request Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Overview Bar Chart */}
      <div style={containerStyle}>
        <h2 style={{ marginBottom: '1rem' }}>Platform Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminStatsPage;

