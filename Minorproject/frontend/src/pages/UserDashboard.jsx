import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getItemsByUserId } from '../api/itemsService';
import { getCategories } from '../api/categoriesService';
import ItemCard from '../components/item/ItemCard';

const UserDashboard = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMyItems = () => {
    if (user) {
      setLoading(true);

      Promise.all([
        getItemsByUserId(user.id),
        getCategories()
      ])
        .then(([itemData, categoryData]) => {
          setMyItems(itemData);
          setCategories(categoryData);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadMyItems();
  }, [user]);

  if (loading) {
    return <h2 className="text-center py-10 text-emerald-700">Loading your items...</h2>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-emerald-900 mb-2">
        Welcome to your Dashboard, {user ? user.name : 'User'}!
      </h1>
      <p className="text-stone-600 mb-8">
        Track and manage all the items you’ve donated.
      </p>

      {/* Dashboard Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to="/my-requests"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
        >
          View Requests
        </Link>

        <Link
          to="/rewards-badges"
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
        >
          🏆 Rewards & Badges
        </Link>

        <Link
          to="/leaderboard"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          📊 Leaderboard
        </Link>
      </div>

      {/* Item Grid */}
      {myItems.length === 0 ? (
        <p className="text-stone-700 text-lg">
          You have not donated any items yet.{" "}
          <Link to="/donate-item" className="text-emerald-700 font-semibold underline">
            Donate one now!
          </Link>
        </p>
      ) : (
        <div className="item-grid">
          {myItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              isDashboard={true}
              onDelete={loadMyItems}
              categories={categories}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
