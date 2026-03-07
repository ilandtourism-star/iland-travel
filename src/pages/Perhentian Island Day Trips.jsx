import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';


const PerhentianIslandDayTrips = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Menggunakan ViewModel Hook
    const { vacations: data, loading, error } = useVacations('Perhentian', 'snorkeling');

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
            image: v.imageUrl || "/images/perhentian island/1.png",
            link: v.sku === 'snorkeling-perhentian' ? '/book/perhentian-snorkeling-day-trip' : '/perhentian-island-day-trips',
            buttonText: "View Details",
            description: v.description,
            features: v.features,
            isInSeason: v.isInSeason,
            badge: v.name.includes('Snorkeling') ? "Most Popular" : null
        }));
    }, [data, debouncedSearchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#64748b' }}>Memuatkan Pakej Perhentian...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '100px', color: 'red' }}>Ralat: {error}</div>;

    return (
        <div className="perhentian-page-body">

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
                        <h1>Perhentian Island Day Trips: {activities.length} Activities Found</h1>
                    </div>

                    <div className="island-activities-grid">
                        {activities.map((activity, index) => (
                            <ActivityCard key={index} {...activity} />
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
}

export default PerhentianIslandDayTrips;
