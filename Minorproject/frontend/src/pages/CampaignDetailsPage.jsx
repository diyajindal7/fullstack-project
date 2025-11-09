// src/pages/CampaignDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCampaignById } from '../api/campaignsService';

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getCampaignById(id);
        setCampaign(data);
      } catch (err) {
        console.error('Error loading campaign:', err);
        setError('Failed to load campaign: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [id]);

  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '2rem' }}>Loading campaign...</h2>;
  }

  if (error || !campaign) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Campaign Not Found</h2>
        <p style={{ color: '#666' }}>{error || 'The campaign you are looking for does not exist.'}</p>
      </div>
    );
  }

  const cardStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={cardStyle}>
        {campaign.image_url && (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        
        <h1 style={{ marginBottom: '0.5rem' }}>{campaign.title}</h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          by <strong>{campaign.ngo_name}</strong>
          {campaign.ngo_location && <span> • 📍 {campaign.ngo_location}</span>}
        </p>

        {campaign.category && (
          <span style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#e7f3ff',
            color: '#007bff',
            borderRadius: '4px',
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}>
            {campaign.category}
          </span>
        )}

        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <h3>Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555' }}>
            {campaign.description}
          </p>
        </div>

        {(campaign.start_date || campaign.end_date) && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Campaign Dates</h4>
            {campaign.start_date && (
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Start:</strong> {new Date(campaign.start_date).toLocaleDateString()}
              </p>
            )}
            {campaign.end_date && (
              <p style={{ margin: '0.25rem 0' }}>
                <strong>End:</strong> {new Date(campaign.end_date).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {campaign.contact_link && (
          <div style={{ marginTop: '1.5rem' }}>
            <a
              href={campaign.contact_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '500'
              }}
            >
              Contact / Donate
            </a>
          </div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #ddd', color: '#999', fontSize: '0.85rem' }}>
          <p>Campaign created: {new Date(campaign.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPage;

