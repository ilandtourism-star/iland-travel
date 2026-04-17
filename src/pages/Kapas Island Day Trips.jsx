// --- IMPORTS ---
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';
import SEO from '../components/common/SEO';
import { getActivityLink } from '../utils/activityLinks';

// --- IMAGES ---
import imgRelax from '../assets/images/kapas island/1. Relaxation Package/1.png';
import imgMental from '../assets/images/kapas island/2. Mental Escape/1.png';
import imgJoy from '../assets/images/kapas island/3. Joy & Playfulness (Top Pick!)/2.png';
import imgMood from '../assets/images/kapas island/4. Mood Booster/6.png';
// Private Boats
import imgBoat10 from '../assets/images/Private Boat Trip/1.png';
import imgBoat15 from '../assets/images/Private Boat Trip/2.png';
import imgBoat25 from '../assets/images/Private Boat Trip/3.png';
import imgBoat40 from '../assets/images/Private Boat Trip/4.png';
// Private Packages
import imgPkg10 from '../assets/images/Private Boat Package/1.png';
import imgPkg15 from '../assets/images/Private Boat Package/2.png';
import imgPkg25 from '../assets/images/Private Boat Package/3.png';
import imgPkg40 from '../assets/images/Private Boat Package/makan.png';

const KapasIslandDayTrips = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Menggunakan ViewModel Hook
  const { vacations: data, loading, error } = useVacations('Kapas', null);

  // Menggunakan Debounce untuk Live Filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Ambil data yang berkaitan sahaja (snorkeling & private-boat)
  const activities = useMemo(() => {
    if (!data) return [];

    let filtered = data.filter(v =>
      v.category === 'snorkeling' ||
      v.category === 'private-boat' ||
      v.category === 'boat_trip_family' ||
      v.category === 'boat_trip_exclusive'
    );

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.description?.toLowerCase().includes(query)
      );
    }

    // Transform data for ActivityCard if needed
    const mappedData = filtered.map(v => ({
      sku: v.sku,
      title: v.name,
      rating: v.rating,
      reviews: v.reviewCount,
      price: v.price,
      image: (() => {
        const imageMap = {
          'relax-kapas': imgRelax,
          'mental-escape-kapas': imgMental,
          'joy-play-kapas': imgJoy,
          'mood-booster-kapas': imgMood,
          'private-boat-10pax-kapas': imgBoat10,
          'private-boat-15pax-kapas': imgBoat15,
          'private-boat-25pax-kapas': imgBoat25,
          'private-boat-40pax-kapas': imgBoat40,
          'private-package-10pax-kapas': imgPkg10,
          'private-package-15pax-kapas': imgPkg15,
          'private-package-25pax-kapas': imgPkg25,
          'private-package-40pax-kapas': imgPkg40,
        };
        return imageMap[v.sku];
      })() || v.imageUrl || imgJoy,
      link: getActivityLink(v.sku, v.island),
      buttonText: "Buy Now",
      description: v.description,
      // Parse features array safely
      features: (() => {
        try {
          return typeof v.features === 'string' ? JSON.parse(v.features) : (v.features || [
            "Include Snorkeling Equipment & Life Jacket",
            "Return Boat Transfer Included"
          ]);
        } catch (e) {
          return [
            "Include Snorkeling Equipment & Life Jacket",
            "Return Boat Transfer Included"
          ];
        }
      })(),
      isInSeason: v.isInSeason,
      badge: v.sku.includes('joy') ? "Most Popular" : v.sku.includes('package') ? "PREMIUM" : null
    }));

    // Sort by package number (e.g., "1. Relaxation" -> 1) then by price
    return mappedData.sort((a, b) => {
      const getNum = (title) => {
        const match = title.match(/^(\d+)\./);
        return match ? parseInt(match[1]) : 999;
      };

      const numA = getNum(a.title);
      const numB = getNum(b.title);

      if (numA !== numB) {
        return numA - numB;
      }

      // If same number, sort by price (lowest first)
      return a.price - b.price;
    });

  }, [data, debouncedSearchQuery]);
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // --- LOGIC ---

  // Handle Loading & Error States
  if (loading) return <div className="island-page-loading">Loading Kapas Packages...</div>;
  if (error) return <div className="island-page-error">Error: {error}</div>;

  return (
    <div className="kapas-page-body">
      <SEO
        title="Kapas Island Day Trips | Premium Experiences"
        description="Book the most exclusive and best day trips to Kapas Island. Uncover hidden snorkeling spots and private boat tours."
        canonical="/kapas-island-day-trips"
      />

      <div className="hero-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <button className="search-btn" onClick={handleSearch}>SEARCH</button>
        </div>
      </div>

      {/* --- VIEW --- */}
      <div className="main-container">
        <aside className="sidebar">
          <div className="sidebar-map-card">
            <iframe
              src="https://www.google.com/maps?q=5.2043828,103.2078479&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jeti Marang Location"
            ></iframe>
          </div>
        </aside>

        <div className="results-content">
          <div className="results-header">
            <h1>Kapas Island Day Trips: {activities.length} Activities Found</h1>
          </div>

          <div className="island-activities-grid">
            {activities.map((activity, index) => (
              <ActivityCard
                key={index}
                {...activity}
                hideButton={false}
              />
            ))}
          </div>

          <div className="info-box">
            <h2>Activity Details & Locations</h2>
            <dl className="info-list">
              <dt><i className="fas fa-clock"></i> Return Schedule</dt>
              <dd>Return trips to Marang Jetty usually start as early as 1:30 PM and depart every hour thereafter.</dd>

              <dt><i className="fas fa-ticket-alt"></i> Mandatory Fees (Pay at Jetty)</dt>
              <dd>Conservation Fee: RM5 (Adult) / RM2 (Child)</dd>
              <dd>Marine Dept Tax: RM5 (Adult) / RM2 (Child)</dd>

              <dt><i className="fas fa-car"></i> Parking & Check-in</dt>
              <dd>Obtain "Parking Voucher" from office. Once checked in, proceed to jetty.</dd>
            </dl>
          </div>
        </div>
      </div>
    </div >
  );
};

export default KapasIslandDayTrips;
