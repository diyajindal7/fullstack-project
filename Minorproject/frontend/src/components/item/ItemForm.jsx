// src/components/item/ItemForm.jsx
import React, { useState, useEffect } from 'react';
import { getCategories } from '../../api/categoriesService'; // Use ../../ to go up two folders
import Input from '../common/Input'; // <-- This was missing
import Button from '../common/Button';

const ItemForm = ({ onSubmit, initialData = null, buttonText = "Submit" }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories when component loads
  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(data);
        // If not editing and categories exist, set a default
        if (!initialData && data.length > 0) {
          setCategory(data[0].id);
        }
      })
      .catch(err => console.error(err));
  }, []); // Run only once on mount

  // Pre-fill form if we are editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category); // This is the ID
      setLocation(initialData.location || '');
    }
  }, [initialData]);

  // Handle the image file selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      title,
      description,
      category,
      location,
      // In a real app, you'd upload the file. We'll simulate a URL.
      imageUrl: (initialData && initialData.imageUrl && !image) 
        ? initialData.imageUrl 
        : `https://via.placeholder.com/300x200.png?text=${title.replace(' ', '+')}`
    };

    onSubmit(formData); // Send data to the parent page (CreateItemPage or EditItemPage)
  };

  // --- Styles ---
  const formStyle = {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };
  const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block'
  };
  const selectStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  };
   const textareaStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    minHeight: '100px',
    fontFamily: 'sans-serif'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {/* --- Title Input --- */}
      <Input
        label="Item Title"
        type="text"
        placeholder="e.g., Old Wooden Chair"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* --- Description Textarea --- */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          style={textareaStyle}
          placeholder="Add a brief description of the item"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* --- Category Dropdown --- */}
      <div>
        <label style={labelStyle}>Category</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          style={selectStyle}
        >
          {categories.length === 0 ? (
            <option>Loading categories...</option>
          ) : (
            categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* --- Location Input --- */}
      <Input
        label="Location (City, State)"
        type="text"
        placeholder="e.g., New York, NY or Mumbai, Maharashtra"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* --- Image Upload Input --- */}
      <div>
        <label style={labelStyle}>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: '20px' }}
        />
      </div>

      {/* --- Submit Button --- */}
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default ItemForm;