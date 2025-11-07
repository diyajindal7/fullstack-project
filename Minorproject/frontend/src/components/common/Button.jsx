// src/components/common/Button.jsx
import React from 'react';
import styles from './Button.module.css'; // Import the styles

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  
  // Combine the base class 'btn' with the variant class
  const buttonClass = `${styles.btn} ${styles[variant]}`;

  return (
    <button type={type} onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;