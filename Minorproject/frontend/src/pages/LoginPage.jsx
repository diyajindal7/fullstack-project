// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('individual');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, login } = useAuth();
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
      await login(email, password, userType);
      // The useEffect will handle the redirect
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
      <form onSubmit={handleSubmit} className={styles.formContainer} style={formStyle}>
        <h1 className={styles.title} style={{ textAlign: 'center' }}>Login</h1>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
            {error}
          </div>
        )}
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <label className={styles.selectLabel} style={labelStyle}>Login as</label>
          <select 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)} 
            className={styles.select}
            style={selectStyle}
          >
            <option value="individual">User</option>
            <option value="ngo">NGO Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
