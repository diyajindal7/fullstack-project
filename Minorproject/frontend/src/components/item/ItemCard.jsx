import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { deleteItem } from '../../api/itemsService';

const ItemCard = ({ item, isDashboard = false, onDelete }) => {
  const navigate = useNavigate(); 

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(item.id)
        .then(() => {
          alert("Item deleted.");
          if (onDelete) {
            onDelete();
          }
        })
        .catch(err => {
          console.error(err);
          alert("Failed to delete item.");
        });
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-item/${item.id}`);
  };

  const handleCardClick = () => {
    if (!isDashboard) {
      navigate(`/item/${item.id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={!isDashboard ? "cursor-pointer" : ""}
    >
      <Card className="h-full flex flex-col">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-48 object-cover rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mb-4"
          />
        )}
        
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-emerald-900 mb-2">{item.title}</h3>
          <p className="text-stone-700 mb-4 line-clamp-3 leading-relaxed">{item.description}</p>
          
          {item.location && (
            <p className="text-stone-600 text-sm mb-3 flex items-center gap-1">
              <span>📍</span> {item.location}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
              {item.category}
            </span>
            {item.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'Available' ? 'bg-green-100 text-green-800' :
                item.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {item.status}
              </span>
            )}
          </div>

          {isDashboard && item.status === 'Available' && (
            <div className="flex gap-3 mt-auto">
              <Button variant="secondary" onClick={handleEdit} className="flex-1">
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} className="flex-1">
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ItemCard;
