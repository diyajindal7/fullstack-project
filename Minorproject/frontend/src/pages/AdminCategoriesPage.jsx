// src/pages/AdminCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory } from '../api/categoriesService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCategories = () => {
    setLoading(true);
    getCategories()
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;

    addCategory(newCategoryName)
      .then(() => {
        setNewCategoryName(''); // Clear the input
        loadCategories(); // Refresh the list
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id).then(() => loadCategories()); // Refresh list
    }
  };

  if (loading) {
    return <h2>Loading categories...</h2>;
  }

  // --- Styles ---
  const formStyle = { maxWidth: '400px', marginBottom: '2rem' };
  const listStyle = { listStyle: 'none', padding: 0 };
  const itemStyle = {
    backgroundColor: '#fff',
    border: '1px solid var(--border-color)',
    padding: '1rem',
    marginBottom: '0.5rem',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <div>
      <h1>Manage Categories</h1>
      
      {/* Add Category Form */}
      <form onSubmit={handleAdd} style={formStyle}>
        <h3>Add New Category</h3>
        <Input
          label="Category Name"
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <div style={{ width: '200px' }}>
          <Button type="submit">Add Category</Button>
        </div>
      </form>

      {/* Category List */}
      <h3>Existing Categories</h3>
      <ul style={listStyle}>
        {categories.map(cat => (
          <li key={cat.id} style={itemStyle}>
            {cat.name}
            <div style={{ width: '100px' }}>
              <Button variant="danger" onClick={() => handleDelete(cat.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategoriesPage;