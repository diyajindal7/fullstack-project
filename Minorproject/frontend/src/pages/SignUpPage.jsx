// src/pages/SignUpPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // 1. UPDATE THIS IMPORT PATH
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('individual');
  
  const { user, signup } = useAuth(); // 1. Get the new 'signup' function
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect logic
      if (user.user_type === 'admin') navigate('/admin');
      else if (user.user_type === 'ngo') navigate('/ngo-dashboard');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => { // Make this async
    event.preventDefault();
    // 2. Call the new signup function with all arguments
    await signup(name, email, password, userType);
    // The useEffect will handle the redirect
  };

  // --- Styles (no changes) ---
  const formStyle = {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };
  const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block'
  };
  const selectStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={{ textAlign: 'center' }}>Create an Account</h1>
        <Input
          label="Name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <label style={labelStyle}>Sign up as</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            style={selectStyle}
          >
            <option value="individual">User</option>
            <option value="ngo">NGO Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" variant="secondary">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
