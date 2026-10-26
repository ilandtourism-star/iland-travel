import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';
import SEO from '../components/common/SEO';

const RedangFreeDivingDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // ViewModel Hook
  const { vacations } = useVacations('Redang', null);

  // Debounce for live search
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Default exact specifications as requested
  const freeDivingActivity = useMemo(() => {
    const defaultData = {
      sku: 'free-dive-redang',
      title: '2. REDANG FREE DIVING DAYTRIP',
      rating: 0.0,
      reviews: 0,
      price: 299,
      originalPrice: 389,
      image: '/images/Redang island/redang_freediving.jpg',
      description: 'FunDive Redang Island. Diving Points: Bus Wreck, Jetski Wreck, Coral Cave, Lima Island. Terms & conditions: No freediving license required, participants must be able to swim & follow instructions.',
      features: [
        { icon: 'fas fa-video', text: 'Underwater footage & picture' },
        { icon: 'fas fa-clock', text: '1 hour dive for each point' },
        { icon: 'fas fa-utensils', text: '1 x light breakfast & 1 x lunch' },
        { icon: 'fas fa-id-card', text: 'Marine park & district fees included' },
        { icon: 'fas fa-ship', text: 'Return boat included' },
        { icon: 'fas fa-bottle-water', text: 'Free flow mineral water & cold drinks' },
        { icon: 'fas fa-user-shield', text: 'Safety buddies included' },
        { icon: 'fas fa-clock', text: 'Time : 8.00am-4.00pm' },
        { icon: 'fas fa-map-marker-alt', text: 'Pick up jetty : Neill Boat Services Jetty' }
      ],
      link: '/book/redang-free-diving',
      buttonText: 'Buy Now',
      badge: 'Premium Experience',
      isInSeason: true,
      isBooking: false
    };

    // If fetched data has free-dive-redang, integrate seamlessly
    if (vacations && vacations.length > 0) {
      const found = vacations.find(v => v.sku === 'free-dive-redang');
      if (found) {
        return {
          ...defaultData,
          price: found.price || defaultData.price,
          isInSeason: found.isInSeason !== undefined ? found.isInSeason : defaultData.isInSeason,
          image: found.imageUrl || defaultData.image
        };
      }
    }

    return defaultData;
  }, [vacations]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const matchesSearch = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return true;
    const q = debouncedSearchQuery.toLowerCase();
    return (
      freeDivingActivity.title.toLowerCase().includes(q) ||
      freeDivingActivity.description.toLowerCase().includes(q) ||
      freeDivingActivity.features.some(f => f.text.toLowerCase().includes(q))
    );
  }, [debouncedSearchQuery, freeDivingActivity]);

  return (
    <main className="redang-freediving-page">
      <SEO
        title="2. REDANG FREE DIVING DAYTRIP | iland"
        description="FunDive Redang Island. Diving Points: Bus Wreck, Jetski Wreck, Coral Cave, Lima Island. No freediving license required, participants must be able to swim & follow instructions."
        canonical="/redang-freediving-details"
      />

      <div className="hero-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Live search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <button className="search-btn" onClick={handleSearch}>SEARCH</button>
        </div>
      </div>

      <h1 className="page-title" style={{ textAlign: 'center', margin: '24px 0 10px 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#0f172a' }}>
        2. REDANG FREE DIVING DAYTRIP
      </h1>
      <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '25px', fontSize: '1rem' }}>
        Redang Island Dedicated Freediving Experience
      </p>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
        {!matchesSearch && searchQuery && (
          <p style={{ textAlign: 'center', color: '#64748b', margin: '40px 0' }}>
            Tiada aktiviti dijumpai untuk "{searchQuery}"
          </p>
        )}

        {matchesSearch && (
          <div
            className="activities-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 400px))',
              justifyContent: 'center',
              gap: '24px',
              maxWidth: '500px',
              margin: '0 auto',
              width: '100%',
              padding: '10px 0 30px 0'
            }}
          >
            <ActivityCard {...freeDivingActivity} />
          </div>
        )}

        {/* Detailed Info Card */}
        <div
          className="info-box"
          style={{
            maxWidth: '650px',
            margin: '20px auto 0 auto',
            padding: '24px',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>
            <i className="fas fa-water" style={{ color: '#0ea5e9', marginRight: '8px' }}></i>
            Trip Details & Location Highlights
          </h2>
          <dl className="info-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
            <div>
              <dt style={{ fontWeight: '700', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <i className="fas fa-map-marked-alt"></i> 4 Iconic Diving Points
              </dt>
              <dd style={{ margin: '8px 0 0 0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
                  <i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '6px' }}></i> Bus Wreck
                </span>
                <span style={{ backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
                  <i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '6px' }}></i> Jetski Wreck
                </span>
                <span style={{ backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
                  <i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '6px' }}></i> Coral Cave
                </span>
                <span style={{ backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
                  <i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '6px' }}></i> Lima Island
                </span>
              </dd>
            </div>

            <div>
              <dt style={{ fontWeight: '700', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <i className="fas fa-clock"></i> Schedule & Pick-up Point
              </dt>
              <dd style={{ margin: '6px 0 0 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <strong>Time:</strong> 8:00 AM – 4:00 PM <br />
                <strong>Pick up Jetty:</strong> Neill Boat Services Jetty
              </dd>
            </div>

            <div>
              <dt style={{ fontWeight: '700', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <i className="fas fa-clipboard-check"></i> Terms & Conditions
              </dt>
              <dd style={{ margin: '6px 0 0 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                No freediving license required. Participants must be able to swim & follow instructions for safety purposes.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
};

export default RedangFreeDivingDetails;
