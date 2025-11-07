// src/api/apiClient.js
// Default to empty string so calls use Vite dev proxy ("/api" → backend)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// --- Helper: Get Auth Header if token exists ---
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- GET Request ---
export async function getData(endpoint) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

// --- POST Request ---
export async function postData(endpoint, data) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

// --- PUT Request ---
export async function putData(endpoint, data) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

export default API_BASE_URL;
