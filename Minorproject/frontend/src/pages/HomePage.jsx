import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { getCampaigns } from '../api/campaignsService';
import { getTopImpactUpdates } from '../api/impactService';

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [successStories, setSuccessStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    loadCampaigns();
    loadSuccessStories();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (successStories.length > 0) {
      const interval = setInterval(() => {
        setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [successStories]);

  const loadCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const data = await getCampaigns(selectedCategory || null, searchQuery || null);
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const loadSuccessStories = async () => {
    try {
      setLoadingStories(true);
      const data = await getTopImpactUpdates(6);
      setSuccessStories(data || []);
    } catch (error) {
      console.error('Error loading success stories:', error);
    } finally {
      setLoadingStories(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-emerald-900 leading-tight mb-6">
              Give items a second life 🌱
            </h1>
            <p className="text-emerald-800 text-lg md:text-xl mt-4 mb-8 max-w-2xl mx-auto">
              Connect donors and NGOs to grow sustainable impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/items">
                <Button variant="primary" className="text-lg px-8 py-3">
                  Browse Items
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" className="text-lg px-8 py-3">
                  Join Our Community
                </Button>
            </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Our Impact</h2>
            <p className="text-emerald-700 text-lg">Together, we're making a difference</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '1,200+', label: 'Items Donated' },
              { number: '50+', label: 'NGOs Partnered' },
              { number: '3,000+', label: 'Lives Touched' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-sustainable text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                  {stat.number}
          </div>
                <p className="text-stone-700 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Campaigns Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Active Campaigns & Events</h2>
            <p className="text-emerald-700 text-lg">Discover ongoing campaigns by NGOs and see how you can help</p>
          </motion.div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2.5 rounded-full border border-emerald-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-stone-700"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-full border border-emerald-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-stone-700"
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Clothing">Clothing</option>
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {loadingCampaigns ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-stone-700">Loading campaigns...</p>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card-sustainable"
                >
                  {campaign.image_url && (
                    <img
                      src={campaign.image_url}
                      alt={campaign.title}
                      className="w-full h-48 object-cover rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mb-4"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">{campaign.title}</h3>
                  <p className="text-stone-600 text-sm mb-2">
                    by <span className="font-semibold text-emerald-800">{campaign.ngo_name}</span>
                  </p>
                  <p className="text-stone-700 mb-4 line-clamp-3">
                    {campaign.description.length > 100
                      ? campaign.description.substring(0, 100) + '...'
                      : campaign.description}
                  </p>
                  {campaign.category && (
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium mb-4">
                      {campaign.category}
                    </span>
                  )}
                  <Link to={`/campaign/${campaign.id}`} className="block mt-4">
                    <Button variant="primary" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-700 text-lg">No active campaigns at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Success Stories Carousel */}
      {successStories.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Success Stories</h2>
              <p className="text-emerald-700 text-lg">See how donations are making a real impact</p>
            </motion.div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="card-sustainable">
                {loadingStories ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-stone-700">Loading success stories...</p>
                  </div>
                ) : (
                  <motion.div
                    key={currentStoryIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="p-8"
                  >
                    {successStories[currentStoryIndex] && (
                      <div className="flex flex-col md:flex-row gap-6">
                        {successStories[currentStoryIndex].image_url && (
                          <div className="flex-shrink-0">
                            <img
                              src={successStories[currentStoryIndex].image_url}
                              alt="Impact story"
                              className="w-full md:w-64 h-48 object-cover rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                              {successStories[currentStoryIndex].ngo_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-xl text-emerald-900">{successStories[currentStoryIndex].ngo_name}</h3>
                              {successStories[currentStoryIndex].ngo_location && (
                                <p className="text-sm text-stone-600">📍 {successStories[currentStoryIndex].ngo_location}</p>
                              )}
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-stone-600 mb-1">Donated Item:</p>
                            <p className="font-semibold text-emerald-800">{successStories[currentStoryIndex].item_title}</p>
                          </div>
                          <p className="text-stone-700 mb-4 leading-relaxed">{successStories[currentStoryIndex].message}</p>
                          <p className="text-xs text-stone-500">
                            {new Date(successStories[currentStoryIndex].created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* Carousel Controls */}
              {successStories.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {successStories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStoryIndex(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        index === currentStoryIndex
                          ? 'bg-emerald-600 w-8'
                          : 'bg-emerald-200 hover:bg-emerald-300 w-3'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Donations in Action</h2>
            <p className="text-emerald-700 text-lg">See the positive change we're creating together</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "https://media.istockphoto.com/id/1362787530/photo/donation-box-with-stuff.jpg?s=612x612&w=0&k=20&c=AFX1S73Ml80a5S09JTmR8q9WWhEEonUuQJfG-tuzRk0=",
              "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
              "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400"
            ].map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <img 
                  src={url} 
                  alt="Donation impact" 
                  className="w-full h-64 object-cover rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
