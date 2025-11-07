// src/pages/AdminNgosPage.jsx
import React, { useState, useEffect } from 'react';
import { getUsersByRole } from '../api/adminService';
import { getAllRequests } from '../api/requestsService';

const AdminNgosPage = () => {
  const [ngos, setNgos] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both NGOs and all requests
    Promise.all([
      getUsersByRole('ngo'),
      getAllRequests()
    ])
    .then(([ngoData, requestData]) => {
      console.log('NGOs data:', ngoData);
      console.log('Requests data:', requestData);
      setNgos(ngoData || []);
      setRequests(requestData || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error loading NGOs page:', err);
      alert('Failed to load NGOs: ' + (err.message || 'Unknown error'));
      setLoading(false);
    });
  }, []);

  // Helper function to find requests for a specific NGO
  const getRequestsForNgo = (ngoId) => {
    return requests.filter(req => {
      // Backend returns requester_id or requester_name, check both
      return req.requester_id === ngoId || 
             (req.requester && req.requester.id === ngoId);
    });
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

  return (
    <div>
      <h1>Manage NGOs (Requesters)</h1>
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
                  <small>{ngo.email}</small>

                {/* Display the nested list of requests */}
                {ngoRequests.length > 0 ? (
                  <ul style={nestedListStyle}>
                    {ngoRequests.map(req => (
                      <li key={req.id}>
                        {req.item_title || (req.item && req.item.title) || 'Unknown Item'} - <small>Status: {req.status || 'pending'}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{marginTop: '5px', color: 'var(--light-text)'}}>
                    <small>No requests yet.</small>
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