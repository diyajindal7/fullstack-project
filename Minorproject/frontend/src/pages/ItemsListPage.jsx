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
  
  // Filter and sort states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
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

  // Filter and sort items
  useEffect(() => {
    let filtered = [...items];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => {
        const category = categories.find(cat => cat.id === item.category_id);
        return category && category.name === selectedCategory;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Sort items
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

    // For NGOs, sort by location
    if (user && user.user_type === 'ngo' && items.length > 0) {
      const ngoLocation = user.location || '';
      const nearbyItems = [];
      const otherItems = [];

      filtered.forEach(item => {
        if (isNearby(item.location, ngoLocation)) {
          nearbyItems.push(item);
        } else {
          otherItems.push(item);
        }
      });

      setSortedItems([...nearbyItems, ...otherItems]);
    } else {
      setSortedItems(filtered);
    }
  }, [items, user, selectedCategory, searchQuery, sortBy, categories]);

  const isNearby = (itemLocation, ngoLocation) => {
    if (!itemLocation || !ngoLocation) return false;
    const itemLoc = itemLocation.toLowerCase().trim();
    const ngoLoc = ngoLocation.toLowerCase().trim();
    if (itemLoc === ngoLoc) return true;
    if (itemLoc.includes(ngoLoc) || ngoLoc.includes(itemLoc)) return true;
    const itemCity = itemLoc.split(',')[0].trim();
    const ngoCity = ngoLoc.split(',')[0].trim();
    if (itemCity === ngoCity && itemCity.length > 0) return true;
    return false;
  };

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

  const sidebarStyle = {
    width: showFilters ? '280px' : '0',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: showFilters ? '1.5rem' : '0',
    borderRight: '1px solid #ddd',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'sticky',
    top: 0,
    alignSelf: 'flex-start'
  };

  const mainContentStyle = {
    flex: 1,
    padding: '1rem',
    minWidth: '300px'
  };

  const filterButtonStyle = {
    padding: '0.5rem 1rem',
    marginBottom: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Filters - Only show for NGOs */}
      {user && user.user_type === 'ngo' && (
        <div style={sidebarStyle}>
          <button
            style={filterButtonStyle}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
          </button>
          
          {showFilters && (
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Filters & Sort</h3>
              
              {/* Search Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Filter by Category */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="category">By Category</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div style={mainContentStyle}>
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

        {displayItems.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            No items found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemsListPage;
