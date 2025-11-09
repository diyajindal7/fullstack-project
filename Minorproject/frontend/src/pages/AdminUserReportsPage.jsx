// src/pages/AdminUserReportsPage.jsx
import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api/apiClient';

const AdminUserReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState('pending');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to load reports (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Failed to load reports: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (reportId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          admin_remarks: adminRemarks || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update report status');
      }

      alert('Report status updated successfully!');
      setAdminRemarks('');
      setSelectedReport(null);
      setStatus('pending');
      loadData(); // Reload data
    } catch (err) {
      console.error('Error updating report:', err);
      alert('Failed to update report status: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading reports...</h2>;
  }

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const statusColors = {
    pending: '#ffc107',
    reviewed: '#17a2b8',
    resolved: '#28a745',
    dismissed: '#6c757d'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>User Reports</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Review reports submitted by NGOs about user misconduct or policy violations.
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

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div>
          {reports.map(report => (
            <div key={report.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>Report #{report.id}</h3>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: statusColors[report.status] || '#6c757d',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      {report.status?.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    <strong>Reported User:</strong> {report.reported_user_name} ({report.reported_user_email})
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    <strong>Reporter (NGO):</strong> {report.reporter_name} ({report.reporter_email})
                  </p>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>Description:</strong>
                    <p style={{ margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>{report.description}</p>
                  </div>
                  {report.admin_remarks && (
                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
                      <strong>Admin Remarks:</strong>
                      <p style={{ margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>{report.admin_remarks}</p>
                    </div>
                  )}
                  <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>
                    Reported: {new Date(report.created_at).toLocaleString()}
                    {report.updated_at !== report.created_at && (
                      <span> | Updated: {new Date(report.updated_at).toLocaleString()}</span>
                    )}
                  </p>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  {selectedReport?.id === report.id ? (
                    <div style={{ minWidth: '250px' }}>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          marginBottom: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #ccc'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                      </select>
                      <textarea
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                        placeholder="Add admin remarks (optional)"
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
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                          onClick={() => handleUpdateStatus(report.id)}
                          disabled={actionLoading}
                        >
                          Update Status
                        </button>
                        <button
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                          onClick={() => {
                            setSelectedReport(null);
                            setAdminRemarks('');
                            setStatus('pending');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                      onClick={() => {
                        setSelectedReport(report);
                        setStatus(report.status);
                        setAdminRemarks(report.admin_remarks || '');
                      }}
                    >
                      Manage
                    </button>
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

export default AdminUserReportsPage;

