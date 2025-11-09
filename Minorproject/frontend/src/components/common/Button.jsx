// src/components/common/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  
  // Base styles for all buttons
  const baseStyles = "px-5 py-2.5 rounded-full shadow-md font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Variant styles
  const variantStyles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg",
    secondary: "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 hover:shadow-md",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg",
  };
  
  const buttonClass = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={buttonClass}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
