// src/pages/CreateItemPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createItem } from '../api/itemsService';
import ItemForm from '../components/item/ItemForm';

const CreateItemPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDonate = (formData) => {
    if (!user) {
      alert("You must be logged in to donate.");
      return;
    }

    createItem(formData, user)
      .then(() => {
        alert("Thank you! Your item has been listed.");
        navigate('/dashboard');
      })
      .catch(err => {
        console.error(err);
        alert("Failed to list item.");
      });
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Donate a New Item</h1>
      <p style={{ textAlign: 'center' }}>
        Fill out the details below to list your item for donation.
      </p>
      
      {/* This line passes the correct props */}
      <ItemForm onSubmit={handleDonate} buttonText="Donate Item" />
    </div>
  );
};

export default CreateItemPage;