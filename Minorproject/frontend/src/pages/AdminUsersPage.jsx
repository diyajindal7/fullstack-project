// src/pages/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsersByRole } from '../api/adminService';
import { getAllItems } from '../api/itemsService';

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setLoading(true);
    setError('');
    // Fetch both users and all items at the same time
    Promise.all([
      getUsersByRole('individual'),
      getAllItems() 
    ])
    .then(([userData, itemData]) => {
      setUsers(userData.users || userData || []);
      setItems(itemData || []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Failed to load data: ' + (err.message || 'Unknown error'));
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper function to find items for a specific user
  const getItemsForUser = (userId) => {
    return items.filter(item => item.user_id === userId);
  };


  const handleViewItem = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  if (loading) {
    return <h2>Loading users and donated items...</h2>;
  }

  // --- Styles ---
  const listStyle = { listStyle: 'none', padding: 0 };
  const itemStyle = {
    backgroundColor: '#fff',
    border: '1px solid var(--border-color)',
    padding: '1.5rem',
    marginBottom: '1rem',
    borderRadius: '8px',
  };
  const nestedListStyle = {
    listStyle: 'circle',
    paddingLeft: '30px',
    marginTop: '10px'
  };

  if (loading) {
    return <h2>Loading users and donated items...</h2>;
  }

  const buttonStyle = {
    padding: '0.4rem 0.8rem',
    margin: '0.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500'
  };

  const viewButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };


  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Users (Donators)</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        View all users and their donated items. You can view item details.
      </p>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee', 
          color: '#c33', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul style={listStyle}>
          {users.map(user => {
            // Get the items for this specific user
            const userItems = getItemsForUser(user.id); 
            return (
              <li key={user.id} style={itemStyle}>
                <div>
                  <strong style={{fontSize: '1.2rem'}}>{user.name}</strong>
                  <br />
                  <small style={{ color: '#666' }}>{user.email}</small>
                  
                  {/* Display the nested list of items */}
                  {userItems.length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <strong style={{ fontSize: '1rem' }}>Donated Items ({userItems.length}):</strong>
                      <ul style={nestedListStyle}>
                        {userItems.map(item => (
                          <li key={item.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                              <div style={{ flex: 1 }}>
                                <strong>{item.title}</strong>
                                {item.description && (
                                  <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                                    {item.description.length > 100 
                                      ? item.description.substring(0, 100) + '...' 
                                      : item.description}
                                  </p>
                                )}
                                <small style={{ color: '#999' }}>
                                  Category: {item.category || 'N/A'} | 
                                  Created: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                                </small>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                                <button
                                  style={viewButtonStyle}
                                  onClick={() => handleViewItem(item.id)}
                                  title="View item details"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p style={{marginTop: '10px', color: '#999', fontStyle: 'italic'}}>
                      No donations yet.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminUsersPage;