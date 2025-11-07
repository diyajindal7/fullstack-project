// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    textAlign: 'center',
    padding: '2rem 0',
    marginTop: '4rem', // Pushes the footer down from the content
    borderTop: '1px solid #e7e7e7'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#007bff',
    margin: '0 10px'
  };

  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} Repurpose App. All Rights Reserved.</p>
      <div>
        <Link to="/about" style={linkStyle}>About</Link>
        |
        <Link to="/contact" style={linkStyle}>Contact</Link>
        |
        <Link to="/privacy" style={linkStyle}>Privacy Policy</Link>
      </div>
    </footer>
  );
};

export default Footer;