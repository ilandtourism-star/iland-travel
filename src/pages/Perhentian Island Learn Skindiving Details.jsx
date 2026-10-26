import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';
import SEO from '../components/common/SEO';

const PerhentianLearnSkindivingDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // ViewModel Hook
  const { vacations } = useVacations('Perhentian', null);

  // Debounce for live search
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Default exact specifications for 2. LEARN SKINDIVING
  const skindivingActivity = useMemo(() => {
    const defaultData = {
      sku: 'skin-dive-perhentian',
      title: '2. LEARN SKINDIVING',
      rating: 0.0,
      reviews: 0,
      price: 260,
      originalPrice: 338,
      image: '/images/perhentian island/learn_skindiving.jpg',
      description: 'Your first step into freediving. 1.5 Hours Learning Session. Suitable for beginner to intermediate snorkelers.',
      features: [
        { icon: 'fas fa-clock', text: 'Time : 8.00am-4.00pm' },
        { icon: 'fas fa-map-marker-alt', text: 'Pick up jetty : Kuala Besut Jetty' },
        { icon: 'fas fa-clock', text: '1.5 Hours Learning Session' },
        { icon: 'fas fa-ship', text: 'Return Boat Transfer (KB Jetty - Perhentian)' },
        { icon: 'fas fa-water', text: 'Guided shallow dive (5-10m)' },
        { icon: 'fas fa-lungs', text: 'Proper breathing & relaxations' },
        { icon: 'fas fa-swimmer', text: 'Duck dive & equalization basics' }
      ],
      link: '/book/perhentian-learn-skindiving',
      buttonText: 'Buy Now',
      badge: 'Premium Experience',
      isInSeason: true,
      isBooking: false
    };

    // If fetched data has skin-dive-perhentian, integrate seamlessly
    if (vacations && vacations.length > 0) {
      const found = vacations.find(v => v.sku === 'skin-dive-perhentian');
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
      skindivingActivity.title.toLowerCase().includes(q) ||
      skindivingActivity.description.toLowerCase().includes(q) ||
      skindivingActivity.features.some(f => f.text.toLowerCase().includes(q))
    );
  }, [debouncedSearchQuery, skindivingActivity]);

  return (
    <main className="perhentian-skindiving-page">
      <SEO
        title="2. LEARN SKINDIVING | iland"
        description="Your first step into freediving. 1.5 Hours Learning Session in Perhentian Island. Suitable for beginner to intermediate snorkelers."
        canonical="/perhentian-skindiving-details"
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
        2. LEARN SKINDIVING
      </h1>
      <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '25px', fontSize: '1rem' }}>
        Perhentian Island Dedicated Skindiving Learning Session
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
            <ActivityCard {...skindivingActivity} />
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
            Session Details & Learning Highlights
          </h2>
          <dl className="info-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
            <div>
              <dt style={{ fontWeight: '700', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <i className="fas fa-graduation-cap"></i> What You Will Learn
              </dt>
              <dd style={{ margin: '8px 0 0 0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
                  <i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '6px' }}></i> Proper Breathing & Relaxation
                </span>
                <span style={{ backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
                  <i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '6px' }}></i> Duck Dive Basics
                </span>
                <span style={{ backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
                  <i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '6px' }}></i> Equalization Basics
                </span>
                <span style={{ backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>
                  <i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '6px' }}></i> Guided Shallow Dive (5-10m)
                </span>
              </dd>
            </div>

            <div>
              <dt style={{ fontWeight: '700', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <i className="fas fa-clock"></i> Schedule & Pick-up Point
              </dt>
              <dd style={{ margin: '6px 0 0 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <strong>Time:</strong> 8:00 AM – 4:00 PM (1.5 Hours Learning Session) <br />
                <strong>Pick up Jetty:</strong> Kuala Besut Jetty
              </dd>
            </div>

            <div>
              <dt style={{ fontWeight: '700', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <i className="fas fa-clipboard-check"></i> Suitability
              </dt>
              <dd style={{ margin: '6px 0 0 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Your first step into freediving. Suitable for beginner to intermediate snorkelers.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
};

export default PerhentianLearnSkindivingDetails;
