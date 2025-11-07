import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/item/ItemCard';
import { getItems } from '../api/itemsService';
import { getCategories } from '../api/categoriesService'; // 1. Import getCategories

const ItemsListPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]); // 2. Add state for categories
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Fetch both items and categories
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

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Browse Repurposed Items</h1>
      <div style={containerStyle}>
        {items.map(item => (
          <Link to={`/item/${item.id}`} key={item.id} style={linkStyle}>
            {/* 4. Pass categories list as a prop */}
            <ItemCard item={item} categories={categories} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemsListPage;
