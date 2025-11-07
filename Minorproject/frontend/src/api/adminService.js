// src/api/adminService.js
import API_BASE_URL from './apiClient';

// Fetch users filtered by role from backend (admin-only)
export async function getUsersByRole(role) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/users/role/${role}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Failed to fetch users by role: ${response.status}`);
  }
  return response.json();
}

// Backend login API call
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error(`Login failed: ${response.status}`);
  return response.json();
}
