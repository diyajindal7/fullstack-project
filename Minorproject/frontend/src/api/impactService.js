// src/api/impactService.js
import API_BASE_URL from './apiClient';

export const getImpactUpdates = async (limit = 100) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/impact?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch impact updates');
    return data.updates || [];
  } catch (error) {
    console.error('Error fetching impact updates:', error);
    throw error;
  }
};

export const getTopImpactUpdates = async (limit = 6) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/impact/top?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch top updates');
    return data.updates || [];
  } catch (error) {
    console.error('Error fetching top impact updates:', error);
    throw error;
  }
};

export const createImpactUpdate = async (updateData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/impact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create impact update');
    return data;
  } catch (error) {
    console.error('Error creating impact update:', error);
    throw error;
  }
};

export const getMyImpactUpdates = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/impact/my-updates`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch updates');
    return data.updates || [];
  } catch (error) {
    console.error('Error fetching my impact updates:', error);
    throw error;
  }
};

