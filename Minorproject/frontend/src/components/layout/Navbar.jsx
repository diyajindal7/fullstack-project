import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.user_type) {
      case 'admin': return '/admin';
      case 'ngo': return '/ngo-dashboard';
      case 'individual': default: return '/dashboard';
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>Repurpose</Link>
      <div className={styles.navLinks}>
        
        {/* Logic for "Browse Items" link */}
        {/* Only shows for logged-out users and NGOs */}
        {(!user || user.user_type === 'ngo') && (
          <Link to="/items">Browse Items</Link>
        )}
        
        {/* Logic for logged-in users */}
        {user ? (
          <>
            {/* Show 'Donate Item' only to 'individual' */}
            {user.user_type === 'individual' && (
              <Link to="/donate-item">Donate Item</Link>
            )}

            {/*
              THIS IS THE FIX:
              Only show the "Chat" link if the user is NOT an admin.
            */}
            {user.user_type !== 'admin' && (
              <Link to="/chat">Chat</Link>
            )}

            <Link to={getDashboardPath()}>Dashboard</Link>
            <span onClick={handleLogout}>Logout</span>
          </>
        ) : (
          // Logic for logged-out users
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

