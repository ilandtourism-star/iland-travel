import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';


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

        let filtered = data;

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
            image: v.imageUrl || (v.sku.includes('snorkeling') ? "/images/Redang island/2.jpg" : "/images/Squid Jigging/1.png"),
            link: (() => {
                const map = {
                    'squid-jigging-redang': '/book/redang-squid-jigging-private',
                    'snorkeling-redang': '/book/redang-snorkeling-day-trip'
                };
                return map[v.sku] || '/redang-island-day-trips';
            })(),
            buttonText: "View Details",
            description: v.description,
            features: v.features,
            isInSeason: v.isInSeason,
            badge: v.sku.includes('snorkeling') ? "Most Popular" : null
        }));
    }, [data, debouncedSearchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#64748b' }}>Memuatkan Pakej Redang...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '100px', color: 'red' }}>Ralat: {error}</div>;

    return (
        <div className="redang-page-body">

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

            <div className="main-container">

                <aside className="sidebar">
                    <div className="map-box">Show on Map</div>

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
