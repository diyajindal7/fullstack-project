import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getItemsByUserId } from '../api/itemsService';
import { getCategories } from '../api/categoriesService'; // 1. Import getCategories
import ItemCard from '../components/item/ItemCard';

const UserDashboard = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [categories, setCategories] = useState([]); // 2. Add state for categories
  const [loading, setLoading] = useState(true);

  const loadMyItems = () => {
    if (user) {
      setLoading(true);
      // 3. Fetch both user's items and categories
      Promise.all([
        getItemsByUserId(user.id),
        getCategories()
      ])
      .then(([itemData, categoryData]) => {
        setMyItems(itemData);
        setCategories(categoryData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    loadMyItems();
  }, [user]);

  if (loading) {
    return <h2>Loading your items...</h2>;
  }

  // --- Styles (no change) ---
  const itemGridStyle = { /* ... */ };

  return (
    <div>
      <h1>Welcome to your Dashboard, {user ? user.name : 'User'}!</h1>
      <p>Here you can track the status of all the items you have donated.</p>
      
      <div style={itemGridStyle}>
        {myItems.length === 0 ? (
          <p>You have not donated any items yet. <Link to="/donate-item">Donate one now!</Link></p>
        ) : (
          myItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              isDashboard={true}
              onDelete={loadMyItems}
              categories={categories} // 4. Pass categories list as a prop
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
