// --- IMPORTS ---
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';
import SEO from '../components/common/SEO';
import { getActivityLink } from '../utils/activityLinks';

// --- IMAGES ---
import imgPakejA from '../assets/images/kapas island/1. Relaxation Package/1.png';
import imgPakejB from '../assets/images/kapas island/2. Mental Escape/2.png';
import imgPakejC from '../assets/images/kapas island/3. Joy & Playfulness (Top Pick!)/7.png';
import imgPakejD from '../assets/images/kapas island/4. Mood Booster/7.png';


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
    const privateBoatTrips = [];
    const privateBoatPackages = [];
    const regularActivities = [];

    filtered.forEach(v => {
      // Group "Private Boat Trip" items together
      if (v.name && v.name.includes('Private Boat Trip')) {
        privateBoatTrips.push(v);
      } else if (v.name && v.name.includes('Private Boat Package')) {
        privateBoatPackages.push(v);
      } else {
        regularActivities.push(v);
      }
    });

    const mappedData = regularActivities.map(v => ({
      sku: v.sku,
      title: v.sku === 'relax-kapas' ? 'PACKAGE A' : v.sku === 'mental-escape-kapas' ? 'PACKAGE B' : v.sku === 'joy-play-kapas' ? 'PACKAGE C' : v.sku === 'mood-booster-kapas' ? 'PACKAGE D' : v.name,
      rating: v.rating,
      reviews: v.reviewCount,
      price: v.price,
      image: (() => {
        const imageMap = {
          'relax-kapas': imgPakejA,
          'mental-escape-kapas': imgPakejB,
          'joy-play-kapas': imgPakejC,
          'mood-booster-kapas': imgPakejD,
        };
        return imageMap[v.sku];
      })() || v.imageUrl || imgPakejA,
      link: getActivityLink(v.sku, v.island),
      buttonText: "Buy Now",
      description: v.description,
      features: v.features,
      isInSeason: v.isInSeason,
      badge: v.sku.includes('joy') ? "Most Popular" : v.sku.includes('package') ? "PREMIUM" : null
    }));

    // if (privateBoatTrips.length > 0) {
    //   privateBoatTrips.sort((a, b) => a.price - b.price);
    //   const baseTrip = privateBoatTrips[0];
      
    //   mappedData.push({
    //     sku: 'combined-private-boat-trip',
    //     title: "5. Private Boat Trip",
    //     rating: baseTrip.rating,
    //     reviews: baseTrip.reviewCount,
    //     price: baseTrip.price,
    //     image: imgBoat10,
    //     images: [imgBoat10, imgBoat15, imgBoat25, imgBoat40],
    //     link: getActivityLink(baseTrip.sku, baseTrip.island),
    //     buttonText: "Buy Now",
    //     hideButton: true, // Hide main button since we have package buttons
    //     hidePrice: true, // Hide main starting price since we have package prices
    //     description: "Experience Kapas Island exclusively with your own group. Choose your boat size.",
    //     features: [
    //       "PRIVATE BOAT TRANSFER",
    //       "SNORKELING EQUIPMENT FULLDAY",
    //       "LIFE JACKET FULLDAY",
    //       { icon: 'fas fa-clock', text: 'Time : 8.30am' },
    //       { icon: 'fas fa-map-marker-alt', text: 'Pick up jetty : Marang Jetty' }
    //     ],
    //     isInSeason: baseTrip.isInSeason,
    //     badge: "PREMIUM",
    //     packages: privateBoatTrips.map(pb => {
    //       let label = pb.name;
    //       const match = pb.name.match(/\((max \d+pax)\)/i);
    //       if (match) {
    //         label = match[1];
    //         // Capitalize 'Max'
    //         label = label.charAt(0).toUpperCase() + label.slice(1);
    //       }
    //       return {
    //         label: label,
    //         price: pb.price,
    //         link: getActivityLink(pb.sku, pb.island),
    //         icon: "fas fa-ship"
    //       };
    //     })
    //   });
    // }

    // if (privateBoatPackages.length > 0) {
    //   privateBoatPackages.sort((a, b) => a.price - b.price);
    //   const basePkg = privateBoatPackages[0];
      
    //   mappedData.push({
    //     sku: 'combined-private-boat-package',
    //     title: "6. Private Boat Package",
    //     rating: basePkg.rating,
    //     reviews: basePkg.reviewCount,
    //     price: basePkg.price,
    //     image: imgPkg10,
    //     images: [imgPkg10, imgPkg15, imgPkg25, imgPkg40],
    //     link: getActivityLink(basePkg.sku, basePkg.island),
    //     buttonText: "Buy Now",
    //     hideButton: true, // Hide main button since we have package buttons
    //     hidePrice: true, // Hide main starting price since we have package prices
    //     description: "An all-inclusive private boat experience with meals, drinks, and multiple snorkeling points.",
    //     features: [
    //       "PRIVATE BOAT TRANSFER",
    //       "ALL ACTIVITIES & EQUIPMENT",
    //       "UNLIMITED COLD DRINK",
    //       "FREE MEALS",
    //       "MORE THAN 1 SNORKELING POINTS",
    //       { icon: 'fas fa-clock', text: 'Time : 8.30am' },
    //       { icon: 'fas fa-map-marker-alt', text: 'Pick up jetty : Marang Jetty' }
    //     ],
    //     isInSeason: basePkg.isInSeason,
    //     badge: "PREMIUM",
    //     packages: privateBoatPackages.map(pb => {
    //       let label = pb.name;
    //       const match = pb.name.match(/\((max \d+pax)\)/i);
    //       if (match) {
    //         label = match[1];
    //         // Capitalize 'Max'
    //         label = label.charAt(0).toUpperCase() + label.slice(1);
    //       }
    //       return {
    //         label: label,
    //         price: pb.price,
    //         link: getActivityLink(pb.sku, pb.island),
    //         icon: "fas fa-ship"
    //       };
    //     })
    //   });
    // }

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
          <div className="sidebar-map-card" style={{ paddingBottom: '15px' }}>
            <iframe
              src="https://www.google.com/maps?q=5.2043828,103.2078479&z=17&output=embed"
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jeti Marang Location"
            ></iframe>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <a 
                href="https://maps.app.goo.gl/ZBBPpGgvBBVtnwbC7" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: '0.9rem', color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}
              >
                <i className="fas fa-external-link-alt"></i> Open in Google Maps
              </a>
            </div>
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
                hideButton={activity.hideButton || false}
                hidePrice={activity.hidePrice || false}
              />
            ))}
          </div>

          <div className="info-box">
            <h2>Activity Details & Locations</h2>
            <dl className="info-list">
              <dt><i className="fas fa-clipboard-list"></i> Morning Itinerary</dt>
              <dd>8.00 am - Standby at Marang Jetty, Counter 1 (Makcik Gemuk)</dd>
              <dd>8.30 am - Depart to Kapas Island</dd>
              <dd>8.45 am - Arrive at Kapas Island</dd>

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
