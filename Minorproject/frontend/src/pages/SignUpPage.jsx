// src/pages/SignUpPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import styles from './SignUpPage.module.css';

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
      const response = await signup(
        name,
        email,
        password,
        userType,
        userType === 'ngo' ? documents : null
      );

      if (userType === 'ngo' && response.requiresVerification) {
        alert(
          "Your registration request has been submitted for review. You'll be notified once approved."
        );
        navigate('/login');
        return;
      }

      await login(email, password, userType);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer} data-aos="zoom-in">

        <h1 className={styles.title}>Create an Account</h1>

        {error && <div className={styles.errorBox}>{error}</div>}

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

        <label className={styles.selectLabel}>Sign up as</label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className={styles.select}
        >
          <option value="individual">User</option>
          <option value="ngo">NGO Member</option>
          <option value="admin">Admin</option>
        </select>

        {userType === 'ngo' && (
          <>
            <label className={styles.selectLabel}>Verification Documents</label>
            <textarea
              value={documents}
              onChange={(e) => setDocuments(e.target.value)}
              placeholder="Enter document URLs or file paths"
              className={styles.select}
              style={{ minHeight: '80px' }}
            />
          </>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
