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
  const [documents, setDocuments] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, signup, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect logic
      if (user.user_type === 'admin') navigate('/admin');
      else if (user.user_type === 'ngo') navigate('/ngo-dashboard');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Sign up the user
      const response = await signup(name, email, password, userType, userType === 'ngo' ? documents : null);
      
      // If NGO signup, show verification message and don't auto-login
      if (userType === 'ngo' && response.requiresVerification) {
        alert('Your registration request has been submitted. Please wait for admin verification. You\'ll be notified via your registered email once approved.');
        navigate('/login');
        return;
      }
      
      // For non-NGOs, automatically log them in
      await login(email, password, userType);
      // The useEffect will handle the redirect
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
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
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        <Input
          label="Name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        {userType === 'ngo' && (
          <div>
            <label style={labelStyle}>Verification Documents (URLs or file paths)</label>
            <textarea
              value={documents}
              onChange={(e) => setDocuments(e.target.value)}
              placeholder="Enter document URLs or file paths (one per line or comma-separated)"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                minHeight: '80px',
                fontFamily: 'inherit'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '-15px', marginBottom: '15px' }}>
              Please provide links to your NGO registration documents, certificates, or other verification documents.
            </small>
          </div>
        )}
        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
