// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
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
    AOS.init({ duration: 900, once: true });
  }, []);

  useEffect(() => {
    if (user) {
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
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer} data-aos="zoom-in">
        <h1 className={styles.title}>Login</h1>

        {error && <div className={styles.errorBox}>{error}</div>}

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

        <label className={styles.selectLabel}>Login as</label>
        <select 
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className={styles.select}
        >
          <option value="individual">User</option>
          <option value="ngo">NGO Member</option>
          <option value="admin">Admin</option>
        </select>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
