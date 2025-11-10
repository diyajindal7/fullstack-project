// src/components/item/ItemCard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Button from '../common/Button';
import { deleteItem } from '../../api/itemsService';
import styles from './ItemCard.module.css';

const ItemCard = ({ item, isDashboard = false, onDelete }) => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(item.id)
        .then(() => {
          onDelete?.();
        })
        .catch(() => alert("Failed to delete item."));
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-item/${item.id}`);
  };

  const handleCardClick = () => {
    if (!isDashboard) navigate(`/item/${item.id}`);
  };

  return (
    <div data-aos="fade-up" className={styles.cardWrapper} onClick={handleCardClick}>
      <div className={styles.card}>
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className={styles.itemImage} />
        )}

        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>

          {item.location && <p className={styles.location}>📍 {item.location}</p>}

          <div className={styles.tags}>
            <span className={styles.category}>{item.category}</span>
            {item.status && (
              <span className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>
                {item.status}
              </span>
            )}
          </div>

          {isDashboard && item.status === 'Available' && (
            <div className={styles.buttonGroup}>
              <Button variant="secondary" onClick={handleEdit}>Edit</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
