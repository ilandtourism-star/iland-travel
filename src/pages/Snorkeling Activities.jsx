import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';

import kapasImg from '../assets/images/kapas.png';
import redangImg from '../assets/images/redang.png';
import perhentianImg from '../assets/images/perhentian.png';

const Snorkeling = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const activities = [
    { id: 1, title: "Snorkeling in Kapas Island", rating: "4.5", reviews: 120, price: "49.00", image: kapasImg },
    { id: 2, title: "Snorkeling in Redang Island", rating: "5.0", reviews: 250, price: "100.00", image: redangImg },
    { id: 3, title: "Snorkeling in Perhentian Island", rating: "4.0", reviews: 85, price: "80.00", image: perhentianImg },
  ];

  return (
    <main>
      <div className="hero-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search activities, destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <button className="search-btn" onClick={handleSearch}>SEARCH</button>
        </div>
      </div>
      <h1 className="page-title" style={{ textAlign: 'center', margin: '20px 0' }}>Snorkeling Activities</h1>
      <div className="container">
        <div className="activities-grid" style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
          {activities.map(item => (
            <ActivityCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Snorkeling;
