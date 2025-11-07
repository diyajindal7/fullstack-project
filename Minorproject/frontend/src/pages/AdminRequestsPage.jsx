// src/pages/AdminRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { getPendingRequests, approveRequest, rejectRequest, completeRequest } from '../api/requestsService';
import Button from '../components/common/Button';

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    setLoading(true);
    getPendingRequests()
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = (id) => {
    approveRequest(id).then(() => loadRequests()); // Refresh list
  };

  const handleReject = (id) => {
    rejectRequest(id).then(() => loadRequests()); // Refresh list
  };

  const handleComplete = (id) => {
    completeRequest(id).then(() => loadRequests());
  };

  if (loading) {
    return <h2>Loading pending requests...</h2>;
  }

  // --- Styles ---
  const requestListStyle = {
    listStyle: 'none',
    padding: 0,
  };

  const requestItemStyle = {
    backgroundColor: '#fff',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
  };

  return (
    <div>
      <h1>Manage Donation Requests</h1>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul style={requestListStyle}>
          {requests.map(req => (
            <li key={req.id} style={requestItemStyle}>
              <div>
                <strong>{req.item_title || (req.item && req.item.title) || 'Item'}</strong>
                <br />
                <small>Requested by: {req.requester_name || (req.requester && req.requester.name) || 'Unknown'}</small>
              </div>
              <div style={buttonGroupStyle}>
                <div style={{ width: '100px' }}>
                  <Button variant="secondary" onClick={() => handleApprove(req.id)}>
                    Approve
                  </Button>
                </div>
                <div style={{ width: '100px' }}>
                  <Button variant="danger" onClick={() => handleReject(req.id)}>
                    Reject
                  </Button>
                </div>
                <div style={{ width: '120px' }}>
                  <Button variant="primary" onClick={() => handleComplete(req.id)}>
                    Mark Complete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminRequestsPage;