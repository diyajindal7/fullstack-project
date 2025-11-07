// src/components/common/Input.jsx
import React from 'react';
import styles from './Input.module.css'; // 1. Import the CSS module

const Input = ({ label, type, value, onChange, placeholder }) => {
  return (
    // 2. Use the class names from the module
    <div className={styles.wrapper}> 
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input} // 3. Apply the input style
        required
      />
    </div>
  );
};

export default Input;