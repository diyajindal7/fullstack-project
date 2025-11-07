// src/pages/ItemDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getItemById } from '../api/itemsService';
import { createRequest } from '../api/requestsService';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const ItemDetailsPage = () => {
  const { itemId } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    getItemById(itemId)
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(error => console.error("Failed to fetch item:", error));
  }, [itemId]);

  const handleRequest = () => {
    createRequest(item, user).then(() => {
      setIsRequested(true);
      alert("Your request has been submitted!");
    });
  };

  // --- Styles ---
  const pageStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    border: '1px solid #eee',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;
  if (!item) return <h2 style={{ textAlign: 'center' }}>Item not found!</h2>;


  // THIS IS THE KEY LOGIC:
  // This function checks the user's role.
  const getButtonState = () => {
    if (isRequested) {
      return { text: 'Requested', disabled: true, variant: 'secondary' };
    }
    if (!user) {
      return { text: 'Login to Request or Donate', disabled: true, variant: 'primary' };
    }
    // Only NGOs can request
    if (user.user_type === 'ngo') {
      return { text: 'Request This Item', disabled: false, variant: 'primary' };
    }
    // Individuals (Donators) see this
    if (user.user_type === 'individual') {
      return { text: 'Only NGOs can request', disabled: true, variant: 'primary' };
    }
    // Admins see this
    if (user.user_type === 'admin') {
      return { text: 'Admin View', disabled: true, variant: 'primary' };
    }
    return { text: 'Login to Request ', disabled: true, variant: 'primary' };
  };

  const buttonState = getButtonState();
  
  return (
    <div style={pageStyle}>
      <h1>{item.title}</h1>
      <p><strong>Category:</strong> {item.category}</p>
      <p>{item.description}</p>
      <div style={{ width: '200px', marginTop: '1rem' }}>
        
        <Button 
          onClick={handleRequest}
          disabled={buttonState.disabled}
          variant={buttonState.variant}
        >
          {buttonState.text}
        </Button>

      </div>
    </div>
  );
};

export default ItemDetailsPage;