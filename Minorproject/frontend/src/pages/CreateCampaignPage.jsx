// src/pages/CreateCampaignPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampaign } from '../api/campaignsService';
import { getCategories } from '../api/categoriesService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contactLink, setContactLink] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      await createCampaign({
        title,
        description,
        category: category || null,
        image_url: imageUrl || null,
        start_date: startDate || null,
        end_date: endDate || null,
        contact_link: contactLink || null
      });

      setSuccess('Campaign created successfully! It will be reviewed by admin before going live.');
      setTimeout(() => {
        navigate('/ngo-dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Failed to create campaign: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Launch Event / Create Campaign</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Create a campaign to let the community know what resources or help you need.
      </p>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <Input
          label="Event/Campaign Title *"
          type="text"
          placeholder="e.g., Food Drive for Homeless"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Description of Needs *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what resources, items, or help you need..."
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              minHeight: '120px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Image/Banner URL (optional)"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <Input
            label="Start Date (optional)"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date (optional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Input
          label="Contact or Donation Link (optional)"
          type="url"
          placeholder="https://example.com/donate"
          value={contactLink}
          onChange={(e) => setContactLink(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/ngo-dashboard')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaignPage;

