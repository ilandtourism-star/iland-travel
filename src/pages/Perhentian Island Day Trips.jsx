import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Custom Hooks ---
import { useVacations } from '../hooks/useVacations';
import { useDebounce } from '../hooks/useDebounce';

// --- Components ---
import ActivityCard from '../components/common/ActivityCard';

const PerhentianIslandDayTrips = () => {
    // --- HOOKS & NAVIGATION ---
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Fetch data using the shared hook
    const { vacations: data, loading, error } = useVacations('Perhentian', 'snorkeling');

    // --- LOGIC: DATA FILTERING & TRANSFORMATION ---
    const activities = useMemo(() => {
        if (!data) return [];

        let filtered = data;

        // Apply Search Filter
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter(v =>
                v.name.toLowerCase().includes(query) ||
                v.description?.toLowerCase().includes(query)
            );
        }

        // Transform into ActivityCard standard props
        return filtered.map(v => ({
            sku: v.sku,
            title: v.name,
            rating: v.rating,
            reviews: v.reviewCount,
            price: v.price,
            image: v.imageUrl || "/images/perhentian island/1.png",
            link: v.sku === 'snorkeling-perhentian' 
                ? '/book/perhentian-snorkeling-day-trip' 
                : '/perhentian-island-day-trips',
            buttonText: "Buy Now",
            description: v.description,
            features: v.features,
            isInSeason: v.isInSeason,
            badge: v.name.includes('Snorkeling') ? "Most Popular" : null
        }));
    }, [data, debouncedSearchQuery]);

    // --- EVENT HANDLERS ---
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // --- CONDITIONAL RENDERING (LOADING/ERROR) ---
    if (loading) {
        return (
            <div className="island-page-loading">
                <i className="fas fa-spinner fa-spin"></i> Memuatkan Pakej Perhentian...
            </div>
        );
    }

    if (error) {
        return (
            <div className="island-page-error">
                <i className="fas fa-exclamation-triangle"></i> Ralat: {error}
            </div>
        );
    }

    return (
        <div className="perhentian-page-body">
            
            {/* --- HERO / SEARCH SECTION --- */}
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

            {/* --- MAIN PAGE LAYOUT --- */}
            <div className="main-container">
                
                {/* Side Navigation / Info */}
                <aside className="sidebar">
                    <div className="sidebar-map-card">
                        <iframe
                            src="https://www.google.com/maps?q=Kuala%20Besut%20Jetty%20Terengganu&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Kuala Besut Jetty Location"
                        ></iframe>
                    </div>
                </aside>

                {/* Listing Results */}
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
