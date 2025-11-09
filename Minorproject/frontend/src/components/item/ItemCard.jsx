import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import styles from './ItemCard.module.css';
import { deleteItem } from '../../api/itemsService'; // Use ../../ to go up two levels

// Accept new props
const ItemCard = ({ item, isDashboard = false, onDelete }) => {
  const navigate = useNavigate(); 

  // Handle Delete
  const handleDelete = (e) => {
    e.preventDefault(); // Stop click from bubbling up
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(item.id)
        .then(() => {
          alert("Item deleted.");
          if (onDelete) {
            onDelete(); // Call the refresh function from the dashboard
          }
        })
        .catch(err => {
          console.error(err);
          alert("Failed to delete item.");
        });
    }
  };

  // Handle Edit
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-item/${item.id}`);
  };

  // Function to get a color for the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return '#28a745'; // Green
      case 'Approved':
        return '#007bff'; // Blue
      case 'Rejected':
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Gray
    }
  };

  return (
    <Card>
      <div className={styles.card}>
        
        {/* THIS IS THE FIX!
          We are replacing the old placeholder <div>
          with a real <img> tag that uses item.imageUrl
        */}
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className={styles.itemImage} 
        />
        
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>
          
          {item.location && (
            <p className={styles.location} style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              📍 {item.location}
            </p>
          )}
          
          <div className={styles.tagsContainer}>
            <span className={styles.categoryTag}>{item.category}</span>
            {item.status && (
              <span 
                className={styles.statusTag} 
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.status}
              </span>
            )}
          </div>

          {/* This is the logic for showing Edit/Delete buttons */}
          {isDashboard && item.status === 'Available' && (
            <div className={styles.buttonGroup}>
              <div className={styles.buttonWrapper}>
                <Button variant="secondary" onClick={handleEdit}>Edit</Button>
              </div>
              <div className={styles.buttonWrapper}>
                <Button variant="danger" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
