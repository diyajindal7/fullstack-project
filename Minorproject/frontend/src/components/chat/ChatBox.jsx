import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import styles from "../../styles/Chat.module.css"; // Path is ../../

// 1. Accept the new 'currentUserRole' prop
const ChatBox = ({ messages, onSend, currentUserRole }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(input);
    setInput("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageArea}>
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            sender={msg.sender} 
            text={msg.text} 
            time={msg.time}
            // 2. Pass the role down to the bubble
            currentUserRole={currentUserRole}
          />
        ))}
      </div>

      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input} // 3. Added class for styling
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
