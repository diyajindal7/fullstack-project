import React from "react";
import styles from "../../styles/Chat.module.css"; // Path is ../../

const MessageBubble = ({ sender, text, time, isOwn, currentUserRole }) => {
  // Use isOwn prop if provided, otherwise fallback to sender check
  const isMyMessage = isOwn !== undefined ? isOwn : (sender === 'You');
  
  return (
    <div className={`${styles.messageBubble} ${isMyMessage ? styles.myMessage : styles.theirMessage}`}>
      <div className={styles.messageContent}>
        <p>{text}</p>
      </div>
      <span className={styles.time}>{time}</span>
    </div>
  );
};

export default MessageBubble;
