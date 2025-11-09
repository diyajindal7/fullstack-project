// src/pages/NgoRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllRequests } from '../api/requestsService';
import { getAllItems } from '../api/itemsService';
import { deleteRequest } from '../api/requestsService';
import Button from '../components/common/Button';

const NgoRequestsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [requestsData, itemsData] = await Promise.all([
        getAllRequests(),
        getAllItems()
      ]);

      setItems(itemsData || []);
      
      // Filter requests made by current NGO
      const myRequests = (requestsData || []).filter(req => 
        req.requester_id === user.id
      );
      setMyRequests(myRequests);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load requests: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId, itemTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your request for "${itemTitle}"?`)) {
      return;
    }

    try {
      await deleteRequest(requestId);
      alert('Request cancelled successfully!');
      loadData(); // Reload data
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Failed to cancel request: ' + (err.message || 'Unknown error'));
    }
  };

  const handleViewItem = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const getItemDetails = (itemId) => {
    return items.find(item => item.id === itemId);
  };

  if (loading) {
    return <h2>Loading your requests...</h2>;
  }

  const listStyle = {
    listStyle: 'none',
    padding: 0,
  };

  const itemStyle = {
    backgroundColor: '#fff',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const buttonStyle = {
    padding: '0.4rem 0.8rem',
    margin: '0.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500'
  };

  const viewButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Donors - My Requests</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        View and manage items you have requested from donors. You can view item details or cancel your requests.
      </p>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee', 
          color: '#c33', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {myRequests.length === 0 ? (
        <p>You haven't requested any items yet.</p>
      ) : (
        <ul style={listStyle}>
          {myRequests.map(request => {
            const item = getItemDetails(request.item_id);
            return (
              <li key={request.id} style={itemStyle}>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {item ? item.title : (request.item_title || 'Unknown Item')}
                  </strong>
                  {item && item.description && (
                    <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                      {item.description.length > 100 
                        ? item.description.substring(0, 100) + '...' 
                        : item.description}
                    </p>
                  )}
                  {item && item.location && (
                    <p style={{ margin: '0.25rem 0', color: '#999', fontSize: '0.85rem' }}>
                      📍 {item.location}
                    </p>
                  )}
                  <small style={{ color: '#666' }}>
                    Status: <strong style={{ 
                      color: request.status === 'approved' ? '#28a745' : 
                             request.status === 'rejected' ? '#dc3545' : 
                             request.status === 'completed' ? '#007bff' : '#ffc107'
                    }}>
                      {request.status || 'pending'}
                    </strong>
                    {' | '}
                    Requested: {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                  </small>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', flexWrap: 'wrap' }}>
                  {item && (
                    <button
                      style={viewButtonStyle}
                      onClick={() => handleViewItem(request.item_id)}
                      title="View item details"
                    >
                      View Item
                    </button>
                  )}
                  <button
                    style={deleteButtonStyle}
                    onClick={() => handleDeleteRequest(request.id, item ? item.title : 'Item')}
                    title="Cancel this request"
                  >
                    Cancel Request
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NgoRequestsPage;

