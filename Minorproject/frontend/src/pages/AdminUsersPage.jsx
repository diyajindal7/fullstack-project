// src/pages/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { getUsersByRole } from '../api/adminService';
import { getAllItems } from '../api/itemsService';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both users and all items at the same time
    Promise.all([
      getUsersByRole('individual'),
      getAllItems() 
    ])
    .then(([userData, itemData]) => {
      setUsers(userData);
      setItems(itemData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Helper function to find items for a specific user
  const getItemsForUser = (userId) => {
    return items.filter(item => item.userId === userId);
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

  return (
    <div>
      <h1>Manage Users (Donators)</h1>
      <ul style={listStyle}>
        {users.map(user => {
          // Get the items for this specific user
          const userItems = getItemsForUser(user.id); 
          return (
            <li key={user.id} style={itemStyle}>
              <div>
                <strong style={{fontSize: '1.2rem'}}>{user.name}</strong>
                <br />
                <small>{user.email}</small>
                
                {/* Display the nested list of items */}
                {userItems.length > 0 ? (
                  <ul style={nestedListStyle}>
                    {userItems.map(item => (
                      <li key={item.id}>
                        {item.title} - <small>Status: {item.status}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{marginTop: '5px', color: 'var(--light-text)'}}>
                    <small>No donations yet.</small>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminUsersPage;