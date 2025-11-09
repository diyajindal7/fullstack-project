// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatBox from "../components/chat/ChatBox";
import { useAuth } from "../hooks/useAuth";
import { getConversation, sendMessage } from "../api/chatService";
import { getItemById } from "../api/itemsService";
import styles from "../styles/Chat.module.css";

const ChatPage = () => {
  const { itemId, otherUserId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!itemId || !otherUserId) {
      alert('Invalid chat parameters');
      navigate('/dashboard');
      return;
    }

    loadChatData();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [itemId, otherUserId, user]);

  const loadChatData = async () => {
    try {
      setLoading(true);
      const [itemData, messagesData] = await Promise.all([
        getItemById(itemId),
        getConversation(itemId, otherUserId).catch(() => []) // Return empty array if no messages yet
      ]);

      setItem(itemData);
      setMessages(messagesData || []);
      
      // Determine other user info from messages or item
      if (messagesData && messagesData.length > 0) {
        const otherUserMsg = messagesData.find(m => 
          m.sender_id !== user.id
        );
        if (otherUserMsg) {
          setOtherUser({
            id: otherUserMsg.sender_id,
            name: otherUserMsg.sender_name
          });
        }
      } else {
        // If no messages yet, we need to fetch the other user's info
        // The otherUserId is in the URL, we can fetch user info
        try {
          const token = localStorage.getItem('token');
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
          const userRes = await fetch(`${API_BASE_URL}/api/users/${otherUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setOtherUser({
              id: parseInt(otherUserId),
              name: userData.name || 'User'
            });
          } else {
            setOtherUser({
              id: parseInt(otherUserId),
              name: 'User'
            });
          }
        } catch (err) {
          console.error('Could not fetch other user info:', err);
          setOtherUser({
            id: parseInt(otherUserId),
            name: 'User'
          });
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      alert('Failed to load chat: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const messagesData = await getConversation(itemId, otherUserId);
      console.log('Loaded messages:', messagesData); // Debug log
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Don't show alert for polling errors, just log
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    if (text.trim() === "") return;
    
    try {
      const newMessage = await sendMessage(itemId, parseInt(otherUserId), text);
      
      // Add to local state immediately for better UX
      setMessages([...messages, {
        ...newMessage,
        sender_name: user.name
      }]);
      
      // Reload to get server timestamp
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + (error.message || 'Unknown error'));
    }
  };

  if (loading) {
    return <h2>Loading chat...</h2>;
  }

  // Format messages for ChatBox component
  const formattedMessages = messages.map(msg => ({
    id: msg.id,
    sender: msg.sender_id === user.id ? 'You' : (msg.sender_name || 'Other'),
    text: msg.message,
    time: new Date(msg.created_at).toLocaleTimeString(),
    isOwn: msg.sender_id === user.id
  }));

  return (
    <div className={styles.chatPage}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '0.5rem' }}>
          ← Back
        </button>
        <h2 className={styles.title}>
          Chat about: {item?.title || 'Item'}
        </h2>
        {otherUser && (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Chatting with: {otherUser.name}
          </p>
        )}
      </div>
      <div ref={messagesEndRef} />
      <ChatBox 
        messages={formattedMessages} 
        onSend={handleSend}
        currentUserRole={user?.user_type}
      />
    </div>
  );
};

export default ChatPage;
