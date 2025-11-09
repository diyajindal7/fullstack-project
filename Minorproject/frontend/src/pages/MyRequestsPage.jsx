// src/pages/MyRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllRequests } from '../api/requestsService';
import { getItemsByUserId } from '../api/itemsService';
import Button from '../components/common/Button';

const MyRequestsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, requestsData] = await Promise.all([
        getItemsByUserId(user.id),
        getAllRequests()
      ]);

      setMyItems(itemsData || []);
      
      // Filter requests for items owned by current user
      const myItemIds = itemsData.map(item => item.id);
      const myRequests = (requestsData || []).filter(req => {
        // Backend returns item_id directly, check if it matches our items
        return myItemIds.includes(req.item_id);
      });
      setRequests(myRequests);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load requests: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (request) => {
    // Get requester_id from request
    // Backend returns requester_id directly or in requester object
    const requesterId = request.requester_id || (request.requester && request.requester.id);
    
    if (!requesterId) {
      alert('Could not find requester information');
      return;
    }
    
    // Navigate to chat page with item and requester info
    navigate(`/chat/${request.item_id}/${requesterId}`);
  };

  const getItemTitle = (itemId) => {
    const item = myItems.find(i => i.id === itemId);
    return item ? item.title : 'Unknown Item';
  };

  if (loading) {
    return <h2>Loading requests...</h2>;
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
  };

  return (
    <div>
      <h1>Requests for My Items</h1>
      <p>Here you can see NGOs who have requested your donated items and chat with them.</p>
      
      {requests.length === 0 ? (
        <p>No one has requested your items yet.</p>
      ) : (
        <ul style={listStyle}>
          {requests.map(request => (
            <li key={request.id} style={itemStyle}>
              <div>
                <strong>{getItemTitle(request.item_id)}</strong>
                <br />
                <small>
                  Requested by: {request.requester_name || 'Unknown'} 
                  {' | '}
                  Status: <strong>{request.status || 'pending'}</strong>
                </small>
              </div>
              <div style={{ width: '150px' }}>
                <Button 
                  variant="primary" 
                  onClick={() => handleChat(request)}
                >
                  Chat
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRequestsPage;

