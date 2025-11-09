// src/pages/AdminNgosPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsersByRole } from '../api/adminService';
import { getAllRequests } from '../api/requestsService';
import { deleteRequest } from '../api/requestsService';

const AdminNgosPage = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setLoading(true);
    setError('');
    // Fetch both NGOs and all requests
    Promise.all([
      getUsersByRole('ngo'),
      getAllRequests()
    ])
    .then(([ngoData, requestData]) => {
      console.log('NGOs data:', ngoData);
      console.log('Requests data:', requestData);
      setNgos(ngoData.users || ngoData || []);
      setRequests(requestData.requests || requestData || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error loading NGOs page:', err);
      setError('Failed to load NGOs: ' + (err.message || 'Unknown error'));
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper function to find requests for a specific NGO
  const getRequestsForNgo = (ngoId) => {
    return requests.filter(req => {
      // Backend returns requester_id or requester_name, check both
      return req.requester_id === ngoId || 
             (req.requester && req.requester.id === ngoId);
    });
  };

  const handleDeleteRequest = async (requestId, itemTitle) => {
    if (!window.confirm(`Are you sure you want to delete the request for "${itemTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteRequest(requestId);
      alert('Request deleted successfully!');
      loadData(); // Reload data
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Failed to delete request: ' + (err.message || 'Unknown error'));
    }
  };

  const handleViewItem = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  if (loading) {
    return <h2>Loading NGOs and requested items...</h2>;
  }

  // --- Styles ---
  const listStyle = { listStyle: 'none', padding: 0 };
  const itemStyle = {
    backgroundColor: '#fff',
    border: '1px solid var(--border-color)',
    padding: '1.5rem',
    marginBottom: '1rem',
    borderRadius: '8px',
  };
  const nestedListStyle = {
    listStyle: 'circle',
    paddingLeft: '30px',
    marginTop: '10px'
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
      <h1>Manage NGOs (Requesters)</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        View all NGOs and their requests. You can view item details or delete requests.
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

      {ngos.length === 0 ? (
        <p>No NGOs found.</p>
      ) : (
        <ul style={listStyle}>
          {ngos.map(ngo => {
            // Get the requests for this specific NGO
            const ngoRequests = getRequestsForNgo(ngo.id);
            return (
              <li key={ngo.id} style={itemStyle}>
                <div>
                  <strong style={{fontSize: '1.2rem'}}>{ngo.name}</strong>
                  <br />
                  <small style={{ color: '#666' }}>{ngo.email}</small>
                  {ngo.location && (
                    <p style={{ margin: '0.25rem 0', color: '#999', fontSize: '0.85rem' }}>
                      📍 {ngo.location}
                    </p>
                  )}

                  {/* Display the nested list of requests */}
                  {ngoRequests.length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <strong style={{ fontSize: '1rem' }}>Requests ({ngoRequests.length}):</strong>
                      <ul style={nestedListStyle}>
                        {ngoRequests.map(req => (
                          <li key={req.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                              <div style={{ flex: 1 }}>
                                <strong>{req.item_title || (req.item && req.item.title) || 'Unknown Item'}</strong>
                                <br />
                                <small style={{ color: '#666' }}>
                                  Status: <strong style={{ 
                                    color: req.status === 'approved' ? '#28a745' : 
                                           req.status === 'rejected' ? '#dc3545' : 
                                           req.status === 'completed' ? '#007bff' : '#ffc107'
                                  }}>
                                    {req.status || 'pending'}
                                  </strong>
                                  {' | '}
                                  Requested: {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}
                                </small>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                                <button
                                  style={viewButtonStyle}
                                  onClick={() => handleViewItem(req.item_id)}
                                  title="View item details"
                                >
                                  View Item
                                </button>
                                <button
                                  style={deleteButtonStyle}
                                  onClick={() => handleDeleteRequest(req.id, req.item_title || 'Item')}
                                  title="Delete this request"
                                >
                                  Delete Request
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p style={{marginTop: '10px', color: '#999', fontStyle: 'italic'}}>
                      No requests yet.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminNgosPage;