import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';

// Import Kapas Images
import imgRelax from '../assets/images/kapas island/1. Relaxation Package/1.png';
import imgMental from '../assets/images/kapas island/2. Mental Escape/2.png';
import imgJoy from '../assets/images/kapas island/3. Joy & Playfulness (Top Pick!)/7.png';
import imgMood from '../assets/images/kapas island/4. Mood Booster/7.png';
import imgPrivateTrip from '../assets/images/Private Boat Trip/21.png';
import imgExclusive from '../assets/images/Private Boat Package/makan.png';

import { useVacations } from '../hooks/useVacations';
import { getActivityLink } from '../utils/activityLinks';
import SEO from '../components/common/SEO';

const SearchResults = () => {
    const { vacations, loading, error } = useVacations(null, null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState(query);
    const navigate = useNavigate();

    // Update local input state when URL query changes
    useEffect(() => {
        setSearchTerm(query);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    const translateFeature = (text) => {
        if (!text) return text;
        return text
          .replace(/BOT PERGI BALIK/gi, 'RETURN BOAT TRANSFER')
          .replace(/AKTIVITI BEBAS/gi, 'FREE ACTIVITY')
          .replace(/TOILET \(AWAM\)/gi, 'PUBLIC TOILET')
          .replace(/SURAU \(AWAM\)/gi, 'PUBLIC PRAYER ROOM')
          .replace(/SNORKELING \(TAMAN LAUT\)/gi, 'MARINE PARK SNORKELING')
          .replace(/HIKING BUKIT SINGA/gi, 'LION HILL HIKING');
    };

    // Transformation Logic
    const allActivities = vacations.map(v => {
        // Tetapkan gambar gantian (fallback image)
        let fallbackImage = "/images/perhentian island/1.png";
        
        if (v.island === 'Kapas') {
            if (v.sku === 'relax-kapas') fallbackImage = imgRelax;
            else if (v.sku === 'mental-escape-kapas') fallbackImage = imgMental;
            else if (v.sku === 'joy-play-kapas') fallbackImage = imgJoy;
            else if (v.sku === 'mood-booster-kapas') fallbackImage = imgMood;
            else if (v.category === 'boat_trip_family' || v.name.includes('Private Boat Trip')) fallbackImage = imgPrivateTrip;
            else if (v.category === 'boat_trip_exclusive' || v.name.includes('Private Boat Package')) fallbackImage = imgExclusive;
        }

        return {
            sku: v.sku,
            title: v.name,
            rating: v.rating,
            reviews: v.reviewCount,
            price: v.price,
            image: v.imageUrl || fallbackImage,
            link: getActivityLink(v.sku, v.island),
            buttonText: "Buy Now",
            features: v.features ? v.features.map(f => 
                typeof f === 'string' ? translateFeature(f) : { ...f, text: translateFeature(f.text) }
            ) : [],
            badge: v.name.includes('Snorkeling') ? "Best Seller" : (v.category === 'boat_trip_exclusive' ? "PREMIUM" : null)
        };
    });

    useEffect(() => {
        if (query) {
            const results = allActivities.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                (item.features && item.features.some(f => f.text.toLowerCase().includes(query.toLowerCase())))
            );
            setFilteredActivities(results);
        } else {
            setFilteredActivities(allActivities);
        }
    }, [query]);

    if (loading) return <div className="p-5 text-center">Loading search results...</div>;
    if (error) return <div className="p-5 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="home-container search-results-page">
            <SEO 
                title={query ? `Search results for "${query}" | iland` : "Search Activities | iland"}
                description={query ? `Explore the best island activities matching "${query}".` : "Find and book the best island activities in Malaysia."}
            />
            {/* Search Bar in Results Page */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search again..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && navigate(`/search?q=${encodeURIComponent(searchTerm)}`)}
                />
                <button className="search-btn" onClick={() => navigate(`/search?q=${encodeURIComponent(searchTerm)}`)}>SEARCH</button>
            </div>

            <div className="home-section">
                <h2 className="home-section-title">
                    {query ? `Search Results for "${query}"` : "All Activities"}
                </h2>
                {filteredActivities.length > 0 ? (
                    <div className="home-grid">
                        {filteredActivities.map((item, index) => (
                            <ActivityCard key={index} {...item} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No activities found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
