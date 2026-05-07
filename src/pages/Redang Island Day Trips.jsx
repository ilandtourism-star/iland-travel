// --- IMPORTS ---
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';
import { getActivityLink } from '../utils/activityLinks';
import SEO from '../components/common/SEO';


const RedangIslandDayTrips = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Menggunakan ViewModel Hook
    const { vacations: data, loading, error } = useVacations('Redang', null);

    // Menggunakan Debounce untuk Live Filtering
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Ambil data yang berkaitan sahaja
    const activities = useMemo(() => {
        if (!data) return [];

        let filtered = data.filter(v => v.sku !== 'skin-dive-redang');

        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter(v =>
                v.name.toLowerCase().includes(query) ||
                v.description?.toLowerCase().includes(query)
            );
        }

        // Transform data for ActivityCard
        return filtered.map(v => ({
            sku: v.sku,
            title: v.name,
            rating: v.rating,
            reviews: v.reviewCount,
            price: v.price,
            image: v.imageUrl || (v.sku.includes('snorkeling') ? "/images/Redang island/redang_snorkeling_all_in.png" : "/images/Squid Jigging/1.png"),
            link: getActivityLink(v.sku, v.island),
            buttonText: "Buy Now",
            description: v.description,
            features: v.features,
            isInSeason: v.isInSeason,
            badge: v.sku.includes('snorkeling') ? "Most Popular" : (v.sku === 'skin-dive-redang' || v.sku === 'free-dive-redang' ? "Premium Experience" : null)
        }));
    }, [data, debouncedSearchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // --- LOGIC ---

    // Handle Loading & Error States
    if (loading) return <div className="island-page-loading">Loading Redang Packages...</div>;
    if (error) return <div className="island-page-error">Error: {error}</div>;

    return (
        <div className="redang-page-body">
            <SEO
                title="Redang Island Day Trips | Crystal Clear Waters"
                description="Experience the best snorkeling and squid jigging in Redang Island. Book your day trip now."
                canonical="/redang-island-day-trips"
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
                            src="https://www.google.com/maps?q=Merang%20Waterfront%20Jetty%20Terengganu&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Merang Waterfront Jetty Location"
                        ></iframe>
                    </div>
                </aside>

                <div className="results-content">
                    <div className="results-header">
                        <h1>Redang Island Day Trips: {activities.length} Activities Found</h1>
                    </div>

                    <div className="island-activities-grid">
                        {activities.map((activity, index) => (
                            <ActivityCard key={index} {...activity} />
                        ))}
                    </div>


                    {/* Info Box */}
                    <div className="info-box">
                        <h2>Activity Details & Locations</h2>
                        <dl className="info-list">
                            <dt><i className="fas fa-map-marker-alt"></i> Snorkeling Spots</dt>
                            <dd>
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '5px' }}>
                                    <span><i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '5px' }}></i> Little Maldives</span>
                                    <span><i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '5px' }}></i> Pulau Paku</span>
                                    <span><i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '5px' }}></i> Teluk Kurma</span>
                                    <span><i className="fas fa-check" style={{ color: '#2ecc71', marginRight: '5px' }}></i> Ekor Tebu</span>
                                </div>
                            </dd>
                            <dt><i className="fas fa-clock"></i> Operation Hours</dt>
                            <dd>Day Trip: 8:00 AM - 4:00 PM | Squid Jigging: 5:00 PM - 6:00 AM</dd>
                        </dl>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RedangIslandDayTrips;
