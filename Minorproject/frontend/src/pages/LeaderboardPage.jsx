// src/pages/LeaderboardPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../api/pointsService';
import { useAuth } from '../hooks/useAuth';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getLeaderboard(50);
      setLeaderboard(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Silver': return 'from-gray-300 to-gray-500';
      case 'Bronze': return 'from-orange-400 to-orange-600';
      default: return 'from-gray-300 to-gray-500';
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      case 'Bronze': return '🥉';
      default: return '🏅';
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Top Donors Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">See who's making the biggest impact</p>
        </motion.div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-4">
          {leaderboard.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center">
              <p className="text-gray-600">No donors yet. Be the first to make an impact!</p>
            </div>
          ) : (
            leaderboard.map((donor, index) => {
              const rank = index + 1;
              const isCurrentUser = user && user.id === donor.user_id;
              
              return (
                <motion.div
                  key={donor.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border-2 ${
                    isCurrentUser ? 'border-purple-500 shadow-purple-200' : 'border-gray-200'
                  } ${rank <= 3 ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${
                        rank === 1 ? 'text-yellow-500' :
                        rank === 2 ? 'text-gray-400' :
                        rank === 3 ? 'text-orange-500' :
                        'text-gray-600'
                      }`}>
                        {getRankIcon(rank)}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isCurrentUser ? 'text-purple-600' : 'text-gray-800'}`}>
                          {donor.name}
                          {isCurrentUser && <span className="ml-2 text-sm text-purple-500">(You)</span>}
                        </h3>
                        <p className="text-gray-600 text-sm">{donor.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">Points</p>
                        <p className="text-2xl font-bold text-purple-600">{donor.points}</p>
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getBadgeColor(donor.badge)} text-white font-semibold shadow-md`}>
                        <span className="text-lg">{getBadgeIcon(donor.badge)}</span>
                        <span>{donor.badge}</span>
                      </div>
                    </div>
                  </div>
                  
                  {donor.total_donations > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">{donor.total_donations}</span> donation{donor.total_donations !== 1 ? 's' : ''} made
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

