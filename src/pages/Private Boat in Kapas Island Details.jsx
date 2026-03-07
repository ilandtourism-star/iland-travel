import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';

// Import images directly (kept for fallback)
import familyImg from '../assets/images/Private Boat Trip/family.png';
import makanImg from '../assets/images/Private Boat Package/makan.png';

const PrivateBoatTrip = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Menggunakan ViewModel Hook
  const { vacations: data, loading, error } = useVacations('Kapas', null);

  // Menggunakan Debounce untuk Live Filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Filter data mentah sebelum dikumpulkan (grouping)
  const filteredData = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return data;

    const query = debouncedSearchQuery.toLowerCase();
    return data.filter(v =>
      v.name.toLowerCase().includes(query) ||
      v.description?.toLowerCase().includes(query)
    );
  }, [data, debouncedSearchQuery]);

  // Grouping logic moved to useMemo for performance (ViewModel pattern)
  const boatTrips = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const familyTrips = filteredData.filter(v => v.category === 'boat_trip_family');
    const exclusiveTrips = filteredData.filter(v => v.category === 'boat_trip_exclusive');

    const grouped = [];
    if (familyTrips.length > 0) {
      grouped.push({
        sku: familyTrips[0].sku, // Use first SKU for the group's notify form
        title: "1. Private Family Trip in Kapas Island",
        rating: familyTrips[0].rating,
        reviews: familyTrips[0].reviewCount,
        image: familyTrips[0].imageUrl || familyImg,
        packages: familyTrips.map(v => ({
          label: v.name.includes('max') ? v.name.match(/max \d+pax/i)?.[0] || v.name : v.name,
          price: v.price.toLocaleString(),
          link: (() => {
            if (v.name.includes("10pax")) return "/book/kapas-private-boat-10pax";
            if (v.name.includes("15pax")) return "/book/kapas-private-boat-15pax";
            if (v.name.includes("25pax")) return "/book/kapas-private-boat-25pax";
            if (v.name.includes("40pax")) return "/book/kapas-private-boat-40pax";
            return "/book/kapas-private-boat-10pax";
          })(),
          icon: "fas fa-users"
        })),
        description: familyTrips[0].description,
        features: familyTrips[0].features,
        isInSeason: familyTrips[0].isInSeason
      });
    }
    if (exclusiveTrips.length > 0) {
      grouped.push({
        sku: exclusiveTrips[0].sku, // Use first SKU for the group's notify form
        title: "2. Exclusive Private Package in Kapas Island",
        rating: exclusiveTrips[0].rating,
        reviews: exclusiveTrips[0].reviewCount,
        image: exclusiveTrips[0].imageUrl || makanImg,
        packages: exclusiveTrips.map(v => ({
          label: v.name.includes('max') ? v.name.match(/max \d+pax/i)?.[0] || v.name : v.name,
          price: v.price.toLocaleString(),
          link: (() => {
            if (v.name.includes("10pax")) return "/book/kapas-private-package-10pax";
            if (v.name.includes("15pax")) return "/book/kapas-private-package-15pax";
            if (v.name.includes("25pax")) return "/book/kapas-private-package-25pax";
            if (v.name.includes("40pax")) return "/book/kapas-private-package-40pax";
            return "/book/kapas-private-package-10pax";
          })(),
          icon: "fas fa-crown"
        })),
        description: exclusiveTrips[0].description,
        features: exclusiveTrips[0].features,
        isInSeason: exclusiveTrips[0].isInSeason
      });
    }
    return grouped;
  }, [filteredData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#64748b' }}>Loading Boat Trips...</div>;

  if (error) return <div style={{ textAlign: 'center', padding: '100px', color: 'red' }}>Error: {error}</div>;

  return (
    <main>
      <div className="hero-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Live search boat trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <button className="search-btn" onClick={handleSearch}>SEARCH</button>
        </div>
      </div>
      <h1 className="page-title" style={{ textAlign: 'center', margin: '20px 0' }}>Private Boat in Kapas Island Details</h1>

      <div className="container">
        {boatTrips.length === 0 && searchQuery && (
          <p style={{ textAlign: 'center', color: '#64748b', margin: '40px 0' }}>
            No boat trips found matching "{searchQuery}"
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
          {boatTrips.map((boat, index) => (
            <ActivityCard key={index} {...boat} hideBadge={true} isBooking={false} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PrivateBoatTrip;
