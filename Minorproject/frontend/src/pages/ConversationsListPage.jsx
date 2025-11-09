// src/pages/ConversationsListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getConversations } from '../api/chatService';

const ConversationsListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getConversations();
      console.log('Loaded conversations:', data); // Debug log
      setConversations(data || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (conversation) => {
    navigate(`/chat/${conversation.item_id}/${conversation.other_user_id}`);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>My Conversations</h1>
        <p>Loading conversations...</p>
      </div>
    );
  }

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const conversationItemStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const conversationItemHoverStyle = {
    ...conversationItemStyle,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  };

  const leftSectionStyle = {
    flex: 1,
  };

  const rightSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.5rem',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>My Conversations</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        View and continue your previous conversations about items.
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

      {conversations.length === 0 ? (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px' 
        }}>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            No conversations yet.
          </p>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>
            Start a conversation by browsing items and clicking "Chat with Donator" or by viewing requests for your items.
          </p>
        </div>
      ) : (
        <ul style={listStyle}>
          {conversations.map((conv, index) => (
            <li
              key={`${conv.item_id}_${conv.other_user_id}`}
              style={conversationItemStyle}
              onClick={() => handleOpenChat(conv)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={leftSectionStyle}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  {conv.item_title || 'Item'}
                </h3>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                  <strong>Chatting with:</strong> {conv.other_user_name || 'User'}
                </p>
                {conv.last_message && (
                  <p style={{ 
                    margin: 0, 
                    color: '#999', 
                    fontSize: '0.9rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '500px'
                  }}>
                    {conv.last_message}
                  </p>
                )}
              </div>
              <div style={rightSectionStyle}>
                {conv.last_message_time && (
                  <span style={{ 
                    fontSize: '0.85rem', 
                    color: '#999',
                    whiteSpace: 'nowrap'
                  }}>
                    {formatTime(conv.last_message_time)}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenChat(conv);
                  }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Open Chat
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationsListPage;

