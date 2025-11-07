// src/api/requestsService.js
import API_BASE_URL from './apiClient';

/**
 * ✅ Get all requests (public or admin)
 */
export const getAllRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/requests`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch requests');
    return data.requests;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

/**
 * ✅ Get only pending requests (for Admin Dashboard)
 */
export const getPendingRequests = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/requests/pending`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch pending requests');
  return data.requests;
};

/**
 * ✅ Create a new request (logged-in user)
 */
export const createRequest = async (requestData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/requests/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create request');
    return data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

/**
 * ✅ Update request status (admin only)
 * @param {number} requestId - The ID of the request to update
 * @param {string} newStatus - One of ['pending', 'approved', 'rejected', 'completed']
 */
export const updateRequestStatus = async (requestId, newStatus) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update request status');
    return data;
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

/**
 * ✅ Approve a request (wrapper for updateRequestStatus)
 */
export const approveRequest = async (requestId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/approve`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to approve request');
  return data;
};

/**
 * ✅ Reject a request (wrapper for updateRequestStatus)
 */
export const rejectRequest = async (requestId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/reject`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to reject request');
  return data;
};

// ✅ Complete a request (admin)
export const completeRequest = async (requestId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/complete`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to complete request');
  return data;
};
