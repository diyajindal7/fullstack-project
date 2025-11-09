// src/pages/RewardsBadgesPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMyPoints } from '../api/pointsService';

const RewardsBadgesPage = () => {
  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyPoints();
      setPointsData(data);
    } catch (err) {
      console.error('Error loading points:', err);
      setError('Failed to load points: ' + (err.message || 'Unknown error'));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const { points, badge, nextBadge } = pointsData || { points: 0, badge: 'Bronze', nextBadge: { name: 'Silver', required: 50, remaining: 50 } };
  const progress = nextBadge.required ? ((points / nextBadge.required) * 100) : 100;

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
            Rewards & Badges
          </h1>
          <p className="text-gray-600 text-lg">Track your impact and earn recognition</p>
        </motion.div>

        {/* Points Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-white/20"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-600 mb-2">Your Points</p>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {points}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-2">Current Badge</p>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${getBadgeColor(badge)} text-white font-bold text-lg shadow-lg`}>
                <span className="text-2xl">{getBadgeIcon(badge)}</span>
                <span>{badge} Donor</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {nextBadge.remaining > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to {nextBadge.name} Badge</span>
                <span>{points} / {nextBadge.required} points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${getBadgeColor(nextBadge.name)} rounded-full shadow-lg`}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {nextBadge.remaining} more points needed for {nextBadge.name} Badge
              </p>
            </div>
          )}
        </motion.div>

        {/* Badge Levels */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {['Bronze', 'Silver', 'Gold'].map((level, index) => {
            const isActive = badge === level;
            const levelPoints = level === 'Bronze' ? 0 : level === 'Silver' ? 50 : 150;
            const isUnlocked = points >= levelPoints;

            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border-2 ${
                  isActive ? 'border-purple-500 shadow-purple-200' : 'border-gray-200'
                } ${!isUnlocked ? 'opacity-50' : ''}`}
              >
                <div className="text-center">
                  <div className={`text-5xl mb-4 ${isActive ? 'scale-110' : ''}`}>
                    {getBadgeIcon(level)}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isActive ? 'text-purple-600' : 'text-gray-700'
                  }`}>
                    {level} Donor
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {levelPoints === 0 ? 'Starting Level' : `${levelPoints}+ points`}
                  </p>
                  {isActive && (
                    <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      Current Badge
                    </span>
                  )}
                  {!isUnlocked && levelPoints > 0 && (
                    <span className="inline-block px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm">
                      Locked
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How to Earn Points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">💡</span>
            How to Earn Points
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold text-gray-800">Complete a Donation</h4>
                <p className="text-gray-600">Earn <span className="font-bold text-green-600">+10 points</span> when your donated item is marked as completed</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold text-gray-800">Track Your Impact</h4>
                <p className="text-gray-600">See your ranking on the leaderboard and compete with other donors</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <span className="text-2xl">🏆</span>
              <div>
                <h4 className="font-semibold text-gray-800">Unlock Badges</h4>
                <p className="text-gray-600">Progress through Bronze → Silver → Gold as you help more people</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RewardsBadgesPage;

