import React from "react";
import styles from "../../styles/Chat.module.css"; // Path is ../../

// 1. Accept the new 'currentUserRole' prop
const MessageBubble = ({ sender, text, time, currentUserRole }) => {
  
  // 2. The logic is now correct:
  // "Is this my message?" is true if the sender's role matches my role.
  const isMyMessage = sender === currentUserRole;
  
  return (
    // 3. Apply the correct style
    <div className={`${styles.messageBubble} ${isMyMessage ? styles.myMessage : styles.theirMessage}`}>
      <div className={styles.messageContent}>
        <p>{text}</p>
      </div>
      <span className={styles.time}>{time}</span>
    </div>
  );
};

export default MessageBubble;
