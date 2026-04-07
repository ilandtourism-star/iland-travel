import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';

// Import Kapas Images
import imgRelax from '../assets/images/kapas island/1. Relaxation Package/1.png';
import imgMental from '../assets/images/kapas island/2. Mental Escape/1.png';
import imgJoy from '../assets/images/kapas island/3. Joy & Playfulness (Top Pick!)/2.png';
import imgMood from '../assets/images/kapas island/4. Mood Booster/6.png';
import imgPrivateTrip from '../assets/images/Private Boat Trip/21.png';
import imgExclusive from '../assets/images/Private Boat Package/makan.png';

const SearchResults = () => {
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

    // Data Gabungan
    const allActivities = [
        // Kapas Island
        {
            title: "1. Relaxation Package (Kapas)",
            rating: 4.0, reviews: 120, price: 49, image: imgRelax, link: "/kapas-snorkeling-details", buttonText: "Buy Now",
            features: [{ icon: "fas fa-ship", text: "BOAT TRANSFER" }, { icon: "fas fa-vest", text: "LIFE JACKET" }]
        },
        {
            title: "2. Mental Escape (Kapas)",
            rating: 4.5, reviews: 85, price: 59, image: imgMental, link: "/kapas-snorkeling-details", buttonText: "Buy Now",
            features: [{ icon: "fas fa-mask", text: "Snorkeling Gear" }, { icon: "fas fa-ship", text: "Boat Transfer" }]
        },
        {
            title: "3. Joy & Playfulness (Kapas)",
            rating: 5.0, reviews: 200, price: 69, image: imgJoy, link: "/kapas-snorkeling-details", badge: "TOP PICK", buttonText: "Buy Now",
            features: [{ icon: "fas fa-fish", text: "Marine Park Trip" }, { icon: "fas fa-vest", text: "LIFE JACKET" }]
        },
        {
            title: "4. Mood Booster (Kapas)",
            rating: 5.0, reviews: 150, price: 109, image: imgMood, link: "/kapas-snorkeling-details", buttonText: "Buy Now",
            features: [{ icon: "fas fa-hiking", text: "HIKING BUKIT SINGA" }]
        },
        {
            title: "5. Private Family Trip (Kapas)",
            rating: 4.5, reviews: 50, price: 850, image: imgPrivateTrip, link: "/kapas-private-boat-details", buttonText: "Buy Now",
            features: [{ icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" }]
        },
        {
            title: "6. Exclusive Private Package (Kapas)",
            rating: 5.0, reviews: 40, price: 1300, image: imgExclusive, link: "/kapas-private-boat-details", badge: "PREMIUM", buttonText: "Buy Now",
            features: [{ icon: "fas fa-utensils", text: "FREE MEALS" }]
        },
        // Redang Island
        {
            title: "Day Trip Snorkeling (Redang)",
            rating: 4.8, reviews: 180, price: 100, image: "/images/Redang island/2.jpg", link: "/redang-snorkeling-details", badge: "BEST SELLER", buttonText: "Buy Now",
            features: [{ icon: "fas fa-mask", text: "Snorkeling Equipment" }, { icon: "fas fa-utensils", text: "Lunch Pack" }]
        },
        {
            title: "Squid Jigging (Redang)",
            rating: 4.5, reviews: 60, price: 1350, image: "/images/Squid Jigging/1.png", link: "/redang-squid-jigging-details", buttonText: "Buy Now",
            features: [{ icon: "fas fa-moon", text: "Night Trip" }]
        },
        // Perhentian Island
        {
            title: "Day Trip Snorkeling (Perhentian)",
            rating: 4.8, reviews: 156, price: 100, image: "/images/perhentian island/1.png", link: "/perhentian-snorkeling-details", badge: "TOP PICK", buttonText: "Buy Now",
            features: [{ icon: "fas fa-map-marker-alt", text: "SNORKLING TRIP 5/6 POINTS" }]
        }
    ];

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

    return (
        <div className="home-container search-results-page">
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
