// src/pages/AdminNgoVerificationPage.jsx
import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api/apiClient';

const AdminNgoVerificationPage = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ngo-verification/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to load NGOs (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setNgos(data.ngos || []);
    } catch (err) {
      console.error('Error loading NGOs:', err);
      setError('Failed to load NGOs: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (ngoId, status) => {
    if (!window.confirm(`Are you sure you want to ${status === 'Approved' ? 'approve' : 'reject'} this NGO?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ngo-verification/${ngoId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          verification_status: status,
          remarks: remarks || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update verification status');
      }

      const data = await response.json();
      alert(`NGO ${status === 'Approved' ? 'approved' : 'rejected'} successfully! Email notification sent to ${data.email}`);
      setRemarks('');
      setSelectedNgo(null);
      loadData(); // Reload data
    } catch (err) {
      console.error('Error verifying NGO:', err);
      alert('Failed to update verification status: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading NGOs...</h2>;
  }

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    margin: '0.25rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500'
  };

  const approveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white'
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
  };

  const viewButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>NGO Verification</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Review and verify NGO registration requests. Approve or reject based on submitted documents.
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
        <p>No pending NGO verification requests.</p>
      ) : (
        <div>
          {ngos.map(ngo => (
            <div key={ngo.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{ngo.name}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>Email: {ngo.email}</p>
                  {ngo.phone && <p style={{ margin: '0.25rem 0', color: '#666' }}>Phone: {ngo.phone}</p>}
                  {ngo.location && <p style={{ margin: '0.25rem 0', color: '#666' }}>📍 {ngo.location}</p>}
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    Status: <strong style={{
                      color: ngo.verification_status === 'Approved' ? '#28a745' :
                             ngo.verification_status === 'Rejected' ? '#dc3545' : '#ffc107'
                    }}>{ngo.verification_status || 'Pending'}</strong>
                  </p>
                  {ngo.documents && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong>Documents:</strong>
                      <pre style={{
                        backgroundColor: '#f5f5f5',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>{ngo.documents}</pre>
                    </div>
                  )}
                  {ngo.remarks && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong>Admin Remarks:</strong>
                      <p style={{ color: '#666', fontStyle: 'italic' }}>{ngo.remarks}</p>
                    </div>
                  )}
                  <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>
                    Registered: {new Date(ngo.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  {selectedNgo?.id === ngo.id ? (
                    <div style={{ width: '100%', marginTop: '1rem' }}>
                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add remarks (optional)"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          marginBottom: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          minHeight: '60px'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          style={approveButtonStyle}
                          onClick={() => handleVerify(ngo.id, 'Approved')}
                          disabled={actionLoading}
                        >
                          Approve
                        </button>
                        <button
                          style={rejectButtonStyle}
                          onClick={() => handleVerify(ngo.id, 'Rejected')}
                          disabled={actionLoading}
                        >
                          Reject
                        </button>
                        <button
                          style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }}
                          onClick={() => {
                            setSelectedNgo(null);
                            setRemarks('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        style={viewButtonStyle}
                        onClick={() => setSelectedNgo(ngo)}
                      >
                        Verify
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNgoVerificationPage;

