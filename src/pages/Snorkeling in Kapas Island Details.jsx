import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';
import SEO from '../components/common/SEO';

// Import images directly (kept for fallback)
import imgSnorkeling from '../assets/images/kapas island/snorkeling baru.png';

const SnorkelingKapas = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Menggunakan ViewModel Hook
  const { vacations, loading, error } = useVacations('Kapas', 'snorkeling');

  // Menggunakan Debounce untuk Live Filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Logik filtering secara live (Debounced)
  const filteredVacations = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return vacations;

    const query = debouncedSearchQuery.toLowerCase();
    return vacations.filter(pkg =>
      pkg.name.toLowerCase().includes(query) ||
      pkg.description?.toLowerCase().includes(query)
    );
  }, [vacations, debouncedSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#64748b' }}>Loading Snorkeling Packages...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '100px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <main>
      <SEO
        title="Kapas Island Snorkeling Day Trip"
        description="Explore top snorkeling spots in Kapas Island. Crystal clear waters, vibrant coral reefs, and affordable packages."
        canonical="/kapas-snorkeling-details"
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
      <h1 className="page-title" style={{ textAlign: 'center', margin: '20px 0' }}>Kapas Island Snorkeling Day Trip Details</h1>

      <div className="container">
        {filteredVacations.length === 0 && searchQuery && (
          <p style={{ textAlign: 'center', color: '#64748b', margin: '40px 0' }}>
            No packages found for "{searchQuery}"
          </p>
        )}
        <div className="activities-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 350px))',
          justifyContent: 'center',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: '20px'
        }}>
          {filteredVacations.map((pkg) => (
            <ActivityCard
              key={pkg.sku}
              sku={pkg.sku}
              title={pkg.name}
              rating={pkg.rating}
              reviews={pkg.reviewCount}
              price={pkg.price}
              priceColor="red"
              image={pkg.imageUrl || imgSnorkeling}
              description={pkg.description}
              link={(() => {
                const map = {
                  'relax-kapas': '/book/kapas-relaxation',
                  'mental-escape-kapas': '/book/kapas-mental-escape',
                  'joy-play-kapas': '/book/kapas-joy-playfulness',
                  'mood-booster-kapas': '/book/kapas-mood-booster'
                };
                return map[pkg.sku] || '/kapas-island-day-trips';
              })()}
              features={pkg.features}
              isInSeason={pkg.isInSeason}
              isBooking={false}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default SnorkelingKapas;
