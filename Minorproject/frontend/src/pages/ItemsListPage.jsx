import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/item/ItemCard';
import { getItems } from '../api/itemsService';
import { getCategories } from '../api/categoriesService';
import { useAuth } from '../hooks/useAuth';

const ItemsListPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedItems, setSortedItems] = useState([]);

  useEffect(() => {
    // Fetch both items and categories
    Promise.all([
      getItems(),
      getCategories()
    ])
    .then(([itemData, categoryData]) => {
      setItems(itemData);
      setCategories(categoryData);
      setLoading(false);
    })
    .catch(error => {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    });
  }, []);

  // Sort items by location when user is NGO
  useEffect(() => {
    if (user && user.user_type === 'ngo' && items.length > 0) {
      const ngoLocation = user.location || '';
      const nearbyItems = [];
      const otherItems = [];

      items.forEach(item => {
        if (isNearby(item.location, ngoLocation)) {
          nearbyItems.push(item);
        } else {
          otherItems.push(item);
        }
      });

      setSortedItems([...nearbyItems, ...otherItems]);
    } else {
      setSortedItems(items);
    }
  }, [items, user]);

  // Simple function to determine if item is nearby based on location matching
  const isNearby = (itemLocation, ngoLocation) => {
    if (!itemLocation || !ngoLocation) return false;
    
    // Normalize locations (lowercase, trim)
    const itemLoc = itemLocation.toLowerCase().trim();
    const ngoLoc = ngoLocation.toLowerCase().trim();
    
    // Check if they match exactly or if NGO location is part of item location
    if (itemLoc === ngoLoc) return true;
    if (itemLoc.includes(ngoLoc) || ngoLoc.includes(itemLoc)) return true;
    
    // Check for city match (before comma)
    const itemCity = itemLoc.split(',')[0].trim();
    const ngoCity = ngoLoc.split(',')[0].trim();
    if (itemCity === ngoCity && itemCity.length > 0) return true;
    
    return false;
  }; 

  // --- Styles (no change) ---
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center'
  };
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit'
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center' }}>Loading items...</h2>;
  }

  const displayItems = sortedItems.length > 0 ? sortedItems : items;
  const nearbyItems = user && user.user_type === 'ngo' 
    ? displayItems.filter(item => isNearby(item.location, user.location || ''))
    : [];
  const otherItems = user && user.user_type === 'ngo'
    ? displayItems.filter(item => !isNearby(item.location, user.location || ''))
    : displayItems;

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Browse Repurposed Items</h1>
      
      {user && user.user_type === 'ngo' && nearbyItems.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#28a745' }}>📍 Nearby Locations</h2>
          <div style={containerStyle}>
            {nearbyItems.map(item => (
              <Link to={`/item/${item.id}`} key={item.id} style={linkStyle}>
                <ItemCard item={item} categories={categories} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {user && user.user_type === 'ngo' && otherItems.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1rem', marginTop: nearbyItems.length > 0 ? '2rem' : '0', color: '#666' }}>
            {nearbyItems.length > 0 ? '🌍 Other Locations' : 'All Items'}
          </h2>
          <div style={containerStyle}>
            {otherItems.map(item => (
              <Link to={`/item/${item.id}`} key={item.id} style={linkStyle}>
                <ItemCard item={item} categories={categories} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {(!user || user.user_type !== 'ngo') && (
        <div style={containerStyle}>
          {displayItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id} style={linkStyle}>
              <ItemCard item={item} categories={categories} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsListPage;
