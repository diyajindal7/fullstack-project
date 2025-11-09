// src/api/chatService.js
import API_BASE_URL from './apiClient';

/**
 * Get messages for a conversation about an item
 */
export const getConversation = async (itemId, otherUserId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to view messages');
    }

    const response = await fetch(`${API_BASE_URL}/api/messages/conversation/${itemId}/${otherUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch conversation: ${response.status}`);
    }

    const data = await response.json();
    console.log('Conversation API response:', data); // Debug log
    return data.messages || [];
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for current user
 */
export const getConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to view conversations');
    }

    const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch conversations: ${response.status}`);
    }

    const data = await response.json();
    return data.conversations || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Send a message
 */
export const sendMessage = async (itemId, receiverId, message) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to send messages');
    }

    const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        item_id: itemId,
        receiver_id: receiverId,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to send message: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

