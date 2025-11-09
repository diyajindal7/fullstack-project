// src/pages/NgoDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import API_BASE_URL from '../api/apiClient';

const NgoDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.location) {
      setLocation(user.location);
    }
  }, [user]);

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update location');
      }

      const data = await response.json();
      setMessage('Location updated successfully!');
      
      // Update user in context
      if (setUser) {
        setUser({ ...user, location });
      }
      
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.location = location;
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating location:', error);
      setMessage('Failed to update location: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>NGO Dashboard</h1>
      <p>Welcome, {user ? user.name : 'NGO Member'}!</p>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '1rem' }}>Set Your Location</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Set your location to see nearby items first when browsing. 
          Format: City, State (e.g., "Mumbai, Maharashtra" or "New York, NY")
        </p>
        
        <form onSubmit={handleUpdateLocation}>
          <Input
            label="Your Location"
            type="text"
            placeholder="e.g., Mumbai, Maharashtra"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          
          {message && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
              color: message.includes('success') ? '#155724' : '#721c24',
              borderRadius: '4px'
            }}>
              {message}
            </div>
          )}
          
          <div style={{ marginTop: '1rem' }}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Location'}
            </Button>
          </div>
        </form>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <p>Here you can view approved item requests and manage your profile.</p>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {user && user.location 
            ? `Current location: ${user.location}` 
            : 'No location set. Set your location above to see nearby items first.'}
        </p>
        
        <div style={{ marginTop: '1.5rem' }}>
          <Button 
            variant="primary" 
            onClick={() => navigate('/ngo-requests')}
            style={{ marginRight: '1rem' }}
          >
            Manage Donors - My Requests
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;