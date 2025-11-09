// src/api/campaignsService.js
import API_BASE_URL from './apiClient';

export const getCampaigns = async (category = null, search = null) => {
  try {
    let url = `${API_BASE_URL}/api/campaigns`;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch campaigns');
    return data.campaigns || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const getCampaignById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Campaign not found');
    return data.campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
};

export const createCampaign = async (campaignData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(campaignData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create campaign');
    return data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export const getMyCampaigns = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/campaigns/ngo/my-campaigns`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch campaigns');
    return data.campaigns || [];
  } catch (error) {
    console.error('Error fetching my campaigns:', error);
    throw error;
  }
};

export const approveCampaign = async (campaignId, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/campaigns/${campaignId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ approval_status: status })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update campaign');
    return data;
  } catch (error) {
    console.error('Error approving campaign:', error);
    throw error;
  }
};

export const getPendingCampaigns = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/campaigns/admin/pending`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch campaigns');
    return data.campaigns || [];
  } catch (error) {
    console.error('Error fetching pending campaigns:', error);
    throw error;
  }
};

