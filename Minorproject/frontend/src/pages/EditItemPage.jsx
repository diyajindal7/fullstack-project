// src/pages/EditItemPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItem } from '../api/itemsService';
import ItemForm from '../components/item/ItemForm';

const EditItemPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the item's data when the page loads
  useEffect(() => {
    getItemById(itemId)
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [itemId]);

  // 2. Handle the form submission
  const handleEdit = (formData) => {
    updateItem(item.id, formData)
      .then(() => {
        alert("Item updated successfully!");
        navigate('/dashboard'); // Redirect back to the user's dashboard
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update item.");
      });
  };

  if (loading) {
    return <h2>Loading item data...</h2>;
  }

  if (!item) {
    return <h2>Item not found.</h2>;
  }

  // 3. Render the form with the pre-filled data
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Edit Your Donated Item</h1>
      <ItemForm 
        onSubmit={handleEdit} 
        initialData={item} 
        buttonText="Save Changes" 
      />
    </div>
  );
};

export default EditItemPage;
