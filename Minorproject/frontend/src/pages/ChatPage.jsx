// src/pages/ChatPage.jsx
import React, { useState } from "react";
import ChatBox from "../components/chat/ChatBox";
import styles from "../styles/Chat.module.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    if (text.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      sender: "You",
      text,
      time: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className={styles.chatPage}>
      <h2 className={styles.title}>NGO - User Chat</h2>
      <ChatBox messages={messages} onSend={handleSend} />
    </div>
  );
};

export default ChatPage;
