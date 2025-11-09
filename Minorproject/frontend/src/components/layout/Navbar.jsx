import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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
    <nav className="backdrop-blur-lg bg-emerald-50/60 border-b border-emerald-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-emerald-900 tracking-wide hover:text-emerald-700 transition-colors duration-300"
          >
            🌱 Repurpose
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Logic for "Browse Items" link */}
            {(!user || user.user_type === 'ngo') && (
              <Link 
                to="/items" 
                className="text-emerald-800 font-medium hover:text-emerald-900 transition-colors duration-300"
              >
                Browse Items
              </Link>
            )}
            
            {/* Logic for logged-in users */}
            {user ? (
              <>
                {/* Show 'Donate Item' only to 'individual' */}
                {user.user_type === 'individual' && (
                  <Link 
                    to="/donate-item" 
                    className="text-emerald-800 font-medium hover:text-emerald-900 transition-colors duration-300"
                  >
                    Donate Item
                  </Link>
                )}

                {/* Show "Chat" link if the user is NOT an admin */}
                {user.user_type !== 'admin' && (
                  <Link 
                    to="/chat" 
                    className="text-emerald-800 font-medium hover:text-emerald-900 transition-colors duration-300"
                  >
                    Chat
                  </Link>
                )}

                <Link 
                  to={getDashboardPath()} 
                  className="text-emerald-800 font-medium hover:text-emerald-900 transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all duration-300 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              // Logic for logged-out users
              <>
                <Link 
                  to="/login" 
                  className="text-emerald-800 font-medium hover:text-emerald-900 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all duration-300 text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
