// src/pages/HomePage.jsx
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

      {/* HERO SECTION (no background image) */}
      <section className="py-24 px-4 bg-gradient-to-b from-emerald-50 to-emerald-100">
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
              Connect donors and NGOs to create real sustainable impact.
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

      {/* IMPACT STATS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Our Impact</h2>
          <p className="text-emerald-700 text-lg">Together, we're making a difference</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { number: '1,200+', label: 'Items Donated' },
            { number: '50+', label: 'NGOs Partnered' },
            { number: '3,000+', label: 'Lives Touched' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="card-sustainable text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">{stat.number}</div>
              <p className="text-stone-700 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ACTIVE CAMPAIGNS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Active Campaigns & Events</h2>
            <p className="text-emerald-700 text-lg">Discover ongoing campaigns and how you can help</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-full border border-emerald-300 bg-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-full border border-emerald-300 bg-white"
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
            <p className="text-center py-10">Loading...</p>
          ) : campaigns.length > 0 ? (
            <div className="item-grid">
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
                    />
                  )}
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">{campaign.title}</h3>
                  <p className="text-stone-600 text-sm mb-2">by <span className="font-semibold text-emerald-800">{campaign.ngo_name}</span></p>
                  <p className="text-stone-700 mb-4 line-clamp-3">{campaign.description}</p>
                  {campaign.category && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">{campaign.category}</span>}
                  <Link to={`/campaign/${campaign.id}`} className="block mt-4">
                    <Button variant="primary" className="w-full">View Details</Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-stone-700">No campaigns available.</p>
          )}
        </div>
      </section>

      {/* DONATION GALLERY */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Donations in Action 🤝</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            "https://www.storagecafe.com/blog/wp-content/uploads/sites/44/2024/02/book-donations-Dallas.jpg",
            "https://9kilo.com/wp-content/uploads/2021/03/Donate-Electronics-when-Moving.jpg",
            "https://tse1.mm.bing.net/th/id/OIP.3vYR-iJckA57iDHEqgPD3wHaF6?pid=Api&P=0&h=180",
            "https://media.istockphoto.com/photos/donation-box-for-school-supplies-picture-id458287173?k=6&m=458287173&s=612x612&w=0&h=wd7bynxWzrtT-iqTRFAlI7XDGoqZI95X_yT5F88DqII=",
            "https://tse3.mm.bing.net/th/id/OIP.joffqlB-gXi8HnU6irw0WQHaE8?pid=Api&P=0&h=180",
            "https://static.vecteezy.com/system/resources/previews/035/176/404/large_2x/diversity-group-of-volunteer-people-joining-together-in-money-raising-event-for-charity-donation-work-and-ngo-related-activity-such-as-global-warming-environmental-issues-pollution-concept-photo.jpg"
          ].map((url, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img src={url} alt="Donation Impact" className="w-full h-64 object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
