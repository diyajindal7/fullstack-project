// src/api/pointsService.js
import API_BASE_URL from './apiClient';

export const getMyPoints = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/points/my-points`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch points');
    return data;
  } catch (error) {
    console.error('Error fetching points:', error);
    throw error;
  }
};

export const addPoints = async (points = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/points/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ points })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add points');
    return data;
  } catch (error) {
    console.error('Error adding points:', error);
    throw error;
  }
};

export const getLeaderboard = async (limit = 50) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/points/leaderboard?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch leaderboard');
    return data.leaderboard || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

