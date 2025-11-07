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
    if (!token) {
      throw new Error('You must be logged in to create a request');
    }

    const response = await fetch(`${API_BASE_URL}/api/requests/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    // Handle network errors
    if (!response) {
      throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
    }

    const data = await response.json().catch(() => {
      throw new Error(`Server error: Invalid response (${response.status})`);
    });

    if (!response.ok) {
      throw new Error(data.message || `Failed to create request: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating request:', error);
    // Re-throw with a more user-friendly message if it's a network error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Network error: Could not connect to server. Please check if the backend is running on port 5000.');
    }
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
 * ✅ Approve a request (admin only)
 */
export const approveRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to approve requests');
    }

    const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw new Error('Network error: Could not connect to server');
    }

    const data = await response.json().catch(() => {
      throw new Error(`Server error: Invalid response (${response.status})`);
    });

    if (!response.ok) {
      throw new Error(data.message || `Failed to approve request: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error approving request:', error);
    throw error;
  }
};

/**
 * ✅ Reject a request (admin only)
 */
export const rejectRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to reject requests');
    }

    const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw new Error('Network error: Could not connect to server');
    }

    const data = await response.json().catch(() => {
      throw new Error(`Server error: Invalid response (${response.status})`);
    });

    if (!response.ok) {
      throw new Error(data.message || `Failed to reject request: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};

/**
 * ✅ Complete a request (admin only)
 */
export const completeRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to complete requests');
    }

    const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw new Error('Network error: Could not connect to server');
    }

    const data = await response.json().catch(() => {
      throw new Error(`Server error: Invalid response (${response.status})`);
    });

    if (!response.ok) {
      throw new Error(data.message || `Failed to complete request: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error completing request:', error);
    throw error;
  }
};
