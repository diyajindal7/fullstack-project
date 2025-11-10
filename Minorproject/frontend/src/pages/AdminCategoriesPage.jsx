// src/pages/AdminCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { getCategories, addCategory, deleteCategory } from '../api/categoriesService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

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

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    addCategory(newCategoryName).then(() => {
      setNewCategoryName('');
      loadCategories();
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      deleteCategory(id).then(() => loadCategories());
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading categories...</h2>;

  return (
    <div className="admin-cat-container" data-aos="fade-up">
      <h1 className="admin-cat-title" data-aos="zoom-in">Manage Categories</h1>

      {/* Add New Category */}
      <form onSubmit={handleAdd} className="admin-cat-form" data-aos="fade-right">
        <h3>Add New Category</h3>
        <Input
          label="Category Name"
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button type="submit">Add Category</Button>
      </form>

      {/* Category List */}
      <h3 className="admin-cat-sub-title" data-aos="fade-up">Existing Categories</h3>
      <div className="admin-cat-list">
        {categories.map(cat => (
          <div key={cat.id} className="admin-cat-item" data-aos="zoom-in">
            <span>{cat.name}</span>
            <Button variant="danger" onClick={() => handleDelete(cat.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
