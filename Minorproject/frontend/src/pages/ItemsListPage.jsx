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

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([getItems(), getCategories()])
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

  useEffect(() => {
    let filtered = [...items];

    if (selectedCategory) {
      filtered = filtered.filter(item => {
        const category = categories.find(cat => cat.id === item.category_id);
        return category && category.name === selectedCategory;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case 'category':
          const catA = categories.find(c => c.id === a.category_id)?.name || '';
          const catB = categories.find(c => c.id === b.category_id)?.name || '';
          return catA.localeCompare(catB);
        default:
          return 0;
      }
    });

    if (user && user.user_type === 'ngo') {
      const ngoLoc = user.location || '';
      const nearby = [];
      const others = [];

      filtered.forEach(item => {
        isNearby(item.location, ngoLoc) ? nearby.push(item) : others.push(item);
      });

      setSortedItems([...nearby, ...others]);
    } else {
      setSortedItems(filtered);
    }
  }, [items, selectedCategory, searchQuery, sortBy, user, categories]);

  const isNearby = (loc1, loc2) => {
    if (!loc1 || !loc2) return false;
    const a = loc1.toLowerCase().trim();
    const b = loc2.toLowerCase().trim();
    if (a === b) return true;
    if (a.includes(b) || b.includes(a)) return true;
    return a.split(',')[0] === b.split(',')[0];
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading items...</h2>;

  const displayItems = sortedItems.length ? sortedItems : items;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '1rem', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Browse Repurposed Items</h1>

        {/* ALL USERS (DEFAULT) */}
        <div className="item-grid">
          {displayItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ItemCard item={item} categories={categories} />
            </Link>
          ))}
        </div>

        {displayItems.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            No items found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemsListPage;
