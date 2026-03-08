import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import local assets
import kapasImg from '../assets/images/kapas.png';
import redangImg from '../assets/images/redang.png';
import perhentianImg from '../assets/images/perhentian.png';
import homeHero from '../assets/images/home-hero.png';
import clipperShipImg from '../assets/images/clipper-ship-elite.png';

// Import Snorkeling Images
import kapasSnorkelImg from '../assets/images/kapas island/snorkeling.png';
import redangSnorkelImg from '../assets/images/Redang island/snorkeling2.png';
import perhentianSnorkelImg from '../assets/images/perhentian island/snorkeling.png';

// Import Components
import ActivityCard from '../components/common/ActivityCard';
import SEO from '../components/common/SEO';
import OceanFactCard from '../components/common/OceanFactCard';


const Home = () => {
    const activities = [
        {
            id: 1,
            title: "Snorkeling and island hopping in Kapas Island",
            rating: "4.5",
            reviews: 120,
            price: "49.00",
            originalPrice: "89.00",
            image: kapasSnorkelImg,
            link: "/kapas-snorkeling-details",
            buttonText: "View Details",
            isFlashSale: true,
            flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 2.5).toISOString(),
            totalSeats: 20,
            seatsLeft: 3
        },
        {
            id: 2,
            title: "Snorkeling in Redang Island",
            rating: "5.0",
            reviews: 250,
            price: "100.00",
            originalPrice: "160.00",
            image: redangSnorkelImg,
            link: "/redang-snorkeling-details",
            buttonText: "View Details",
            isFlashSale: true,
            flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 4.2).toISOString(),
            totalSeats: 25,
            seatsLeft: 5
        },
        {
            id: 3,
            title: "Snorkeling in Perhentian Island",
            rating: "4.0",
            reviews: 85,
            price: "80.00",
            originalPrice: "135.00",
            image: perhentianSnorkelImg,
            link: "/perhentian-snorkeling-details",
            buttonText: "View Details",
            isFlashSale: true,
            flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 1.8).toISOString(),
            totalSeats: 15,
            seatsLeft: 2
        },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5); // Default volume level 50%
    const [isAudioVisible, setIsAudioVisible] = useState(true); // Control visibility of the floating player
    const audioRef = useRef(null);

    // Auto-play music on load
    useEffect(() => {
        const playMusic = async () => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (error) {
                    console.log("Autoplay is usually blocked by browsers until user interacts with the page.", error);
                    setIsPlaying(false);
                }
            }
        };

        // Attempt to play on mount
        playMusic();

        // Optional: you can add a global click listener to start music on first interaction
        // if autoplay was blocked.
        const handleFirstInteraction = () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.log(e));
                window.removeEventListener('click', handleFirstInteraction);
            }
        };
        window.addEventListener('click', handleFirstInteraction);

        return () => window.removeEventListener('click', handleFirstInteraction);
    }, []);

    const toggleMusic = (e) => {
        // Prevent toggle if clicking on volume slider
        if (e.target.type === 'range') return;

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => console.log("Audio play failed:", error));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };
    // Fetch Flash Sale settings from localStorage
    const [dynamicActivities, setDynamicActivities] = useState(activities);

    React.useEffect(() => {
        const updateActivities = () => {
            const saved = localStorage.getItem('iland_flash_sales');
            if (saved) {
                const settings = JSON.parse(saved);
                setDynamicActivities(activities.map(act => {
                    const setting = settings.find(s => s.id === act.id);
                    if (setting) {
                        return {
                            ...act,
                            isFlashSale: setting.isFlashSale,
                            price: setting.price || act.price,
                            originalPrice: setting.originalPrice || act.originalPrice,
                            flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * (setting.hours || 2.5)).toISOString(),
                            seatsLeft: setting.seatsLeft ?? act.seatsLeft
                        };
                    }
                    return act;
                }));
            }
        };

        updateActivities();
        window.addEventListener('storage', updateActivities);
        return () => window.removeEventListener('storage', updateActivities);
    }, []);
    const [showShareModal, setShowShareModal] = useState(false);
    const navigate = useNavigate();

    // Hook to handle "back" button on phone for Share Modal
    useEffect(() => {
        const handlePopState = () => {
            if (showShareModal) setShowShareModal(false);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [showShareModal]);

    const openShareModal = () => {
        setShowShareModal(true);
        window.history.pushState({ modalOpen: true }, '', window.location.pathname + '#share');
    };

    const closeShareModal = () => {
        setShowShareModal(false);
        if (window.location.hash === '#share') {
            window.history.back();
        }
    };

    const handleSearch = () => {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    // Environmental Trigger - Heat/Traffic Logic
    const [isHotDay, setIsHotDay] = useState(false);
    useEffect(() => {
        // In a real app, this would use a weather API based on user location.
        // For demonstration, we randomly set it or base it on hours (e.g., hottest time 12pm-4pm)
        const currentHour = new Date().getHours();
        if (currentHour >= 11 && currentHour <= 16) {
            setIsHotDay(true);
        }
    }, []);

    // Time-based Trigger - Monday Blues Logic
    const [isMonday, setIsMonday] = useState(false);
    useEffect(() => {
        const today = new Date().getDay();
        setIsMonday(today === 1); // 0 = Sunday, 1 = Monday
    }, []);

    // Emotion: FOMO / Anxiety - Live Booking Toasts
    const [recentBooking, setRecentBooking] = useState(null);
    useEffect(() => {
        const bookings = [
            { name: "Siti from KL", act: "Private Boat Kapas" },
            { name: "John from UK", act: "Snorkeling Redang" },
            { name: "Ali from Johor", act: "Perhentian Package" },
            { name: "Sarah from Penang", act: "Squid Jigging" }
        ];

        // Show a "recent booking" every 15-30 seconds randomly
        const showToast = () => {
            const randomUser = bookings[Math.floor(Math.random() * bookings.length)];
            setRecentBooking(randomUser);
            // Hide it after 5 seconds
            setTimeout(() => setRecentBooking(null), 5000);

            // Schedule next toast
            const nextTime = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
            setTimeout(showToast, nextTime);
        };

        // Initial delay before first toast (10s)
        const initialTimer = setTimeout(showToast, 10000);
        return () => clearTimeout(initialTimer);
    }, []);

    const handleShare = (platform) => {
        const shareUrl = window.location.href;
        const shareText = "Check out the Wall of Fame on Iland! Malaysia's top travelers are here.";

        let url = '';
        switch (platform) {
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
                return;
        }
        if (url) window.open(url, '_blank');
    };

    return (
        <div className="home-container">
            <SEO
                title="Home"
                description="Discover the best island activities in Malaysia including snorkeling, squid jigging, and private boat trips on Kapas, Redang, and Perhentian Islands."
                canonical="/"
            />

            {/* Environmental Trigger Banner */}
            {isHotDay && (
                <div style={{
                    background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
                    color: 'white',
                    padding: '10px 20px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    zIndex: 50,
                    position: 'relative'
                }}>
                    <i className="fas fa-temperature-high" style={{ fontSize: '1.2rem' }}></i>
                    <span>Tired of the heat? Escape to 26°C crystal clear waters today!</span>
                    <button style={{
                        background: 'white',
                        color: '#ef4444',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginLeft: '10px'
                    }} onClick={() => document.querySelector('.home-section-title').scrollIntoView({ behavior: 'smooth' })}>
                        See Packages
                    </button>
                    <button onClick={() => setIsHotDay(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', position: 'absolute', right: '15px' }}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            {/* FOMO Live Booking Toast */}
            {recentBooking && (
                <div style={{
                    position: 'fixed',
                    bottom: '80px',
                    left: '20px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: '#333',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    borderLeft: '4px solid #ef4444',
                    animation: 'slideUp 0.5s ease-out',
                    maxWidth: '300px'
                }}>
                    <div style={{ background: '#f87171', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="fas fa-bell"></i>
                    </div>
                    <div style={{ flex: 1, paddingRight: '15px' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{recentBooking.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>Booked {recentBooking.act} <span style={{ color: '#ef4444', fontWeight: 'bold' }}>2 mins ago!</span></p>
                    </div>

                    {/* Close Toast Button */}
                    <button
                        onClick={() => setRecentBooking(null)}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', position: 'absolute', top: '8px', right: '8px', fontSize: '1rem' }}
                        title="Dismiss"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            {/* Hero Section */}
            <div className="home-hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${homeHero})` }}>
                <div className="home-hero-content">
                    <h1 className="home-hero-title">
                        {isMonday ? "Monday Blues? Plan Your Escape." : "Discover Malaysia's Hidden Gems"}
                    </h1>
                    <p className="home-hero-subtitle">Experience the best island activities: Snorkeling, Squid Jigging, and Private Boat Trips.</p>

                    {/* Search Container */}
                    <div className="search-container" style={{ marginTop: '30px' }}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search activities, destinations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="search-btn" onClick={handleSearch}><i className="fas fa-search"></i> SEARCH</button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="home-content-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

                {/* Practical Value: Live Weather & Tide Status Widget */}
                <div className="home-weather-widget" style={{ marginBottom: '50px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        borderRadius: '16px',
                        padding: '24px',
                        color: 'white',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#0ea5e9', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(14,165,233,0.4)', flexShrink: 0 }}>
                                <i className="fas fa-water"></i>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#38bdf8', fontWeight: 'bold' }}>East Coast Sea Conditions</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Live Tide & Weather Advisory</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Wave</p>
                                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '1.1rem', color: '#22c55e' }}>
                                    <i className="fas fa-check-circle"></i> Calm (0.5m)
                                </p>
                            </div>
                            <div style={{ display: 'none' /* hidden for mobile space */ }} className="weather-desktop-only">
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Visibility</p>
                                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '1.1rem', color: '#38bdf8' }}>
                                    <i className="fas fa-eye"></i> High (15m+)
                                </p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Verdict</p>
                                <span style={{
                                    display: 'inline-block',
                                    marginTop: '5px',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    color: '#22c55e',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    border: '1px solid rgba(34,197,94,0.4)'
                                }}>
                                    Perfect for Island Trips!
                                </span>
                            </div>
                        </div>

                        <button onClick={() => alert("Copied to clipboard! Share the good news with your travel buddies.")} style={{
                            background: '#0ea5e9',
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }} onMouseOver={(e) => { e.target.style.background = '#0284c7'; e.target.style.transform = 'translateY(-2px)' }}
                            onMouseOut={(e) => { e.target.style.background = '#0ea5e9'; e.target.style.transform = 'translateY(0)' }}>
                            <i className="fas fa-share-alt"></i> Share Status
                        </button>
                    </div>
                </div>

                {/* Popular Destinations */}
                <div className="home-section" style={{ padding: '0', marginBottom: '60px' }}>
                    <h2 className="home-section-title">Breathtaking Island Escapes (Awe & Wonder)</h2>
                    <div className="home-grid">
                        {/* Pulau Kapas */}
                        <Link to="/kapas-island-day-trips" className="home-card home-card-awe">
                            <div className="home-image-container">
                                <img src={kapasImg} alt="Pulau Kapas" className="home-image" style={{ transition: 'all 0.8s ease' }} />
                                <div className="home-overlay">
                                    <span className="home-location-tag"><i className="fas fa-map-marker-alt"></i> Terengganu</span>
                                </div>
                            </div>
                            <div className="home-card-content">
                                <h3 className="home-card-title">Pulau Kapas</h3>
                                <p className="home-card-desc">Crystal clear waters perfect for swimming & snorkeling. Known for its relaxing vibe.</p>
                                <div className="home-tag-container">
                                    <Link to="/kapas-snorkeling-details" className="home-tag-link" onClick={(e) => e.stopPropagation()}>Snorkeling</Link>
                                    <Link to="/kapas-private-boat-details" className="home-tag-link" onClick={(e) => e.stopPropagation()}>Private Boat</Link>
                                </div>
                                <span className="home-button btn-awe-copy">Clear My Schedule, Take Me Here! 🚀</span>
                            </div>
                        </Link>

                        {/* Pulau Redang */}
                        <Link to="/redang-island-day-trips" className="home-card home-card-awe">
                            <div className="home-image-container">
                                <img src={redangImg} alt="Pulau Redang" className="home-image" style={{ transition: 'all 0.8s ease' }} />
                                <div className="home-overlay">
                                    <span className="home-location-tag"><i className="fas fa-map-marker-alt"></i> Terengganu</span>
                                </div>
                            </div>
                            <div className="home-card-content">
                                <h3 className="home-card-title">Pulau Redang</h3>
                                <p className="home-card-desc">White sandy beaches and thriving marine parks. Great for luxury stays and diving.</p>
                                <div className="home-tag-container">
                                    <Link to="/redang-snorkeling-details" className="home-tag-link" onClick={(e) => e.stopPropagation()}>Snorkeling</Link>
                                    <Link to="/redang-squid-jigging-details" className="home-tag-link" onClick={(e) => e.stopPropagation()}>Squid Jigging</Link>
                                </div>
                                <span className="home-button btn-awe-copy">Escape Reality Now 🌊</span>
                            </div>
                        </Link>

                        {/* Pulau Perhentian */}
                        <Link to="/perhentian-island-day-trips" className="home-card home-card-awe">
                            <div className="home-image-container">
                                <img src={perhentianImg} alt="Pulau Perhentian" className="home-image" style={{ transition: 'all 0.8s ease' }} />
                                <div className="home-overlay">
                                    <span className="home-location-tag"><i className="fas fa-map-marker-alt"></i> Terengganu</span>
                                </div>
                            </div>
                            <div className="home-card-content">
                                <h3 className="home-card-title">Pulau Perhentian</h3>
                                <p className="home-card-desc">A paradise for backpackers and nature lovers. Vibrant coral reefs and jungle trails.</p>
                                <div className="home-tag-container">
                                    <Link to="/perhentian-snorkeling-details" className="home-tag-link" onClick={(e) => e.stopPropagation()}>Snorkeling</Link>
                                </div>
                                <span className="home-button btn-awe-copy">Unlock the Backpackers Paradise 🎒</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="home-section" style={{ padding: '0' }}>
                    <h2 className="home-section-title">Top Snorkeling and Island Hopping Packages</h2>
                    <div className="home-grid">
                        {dynamicActivities.map(item => (
                            <ActivityCard key={item.id} {...item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Side-Scrolling Wall of Fame Section */}
            <div className="wof-scroll-section" style={{ background: '#0f172a', padding: '30px 0', borderBottom: '1px solid rgba(0, 255, 255, 0.1)' }}>
                <style>
                    {`
                    .wof-scroll-container {
                        display: flex;
                        overflow-x: auto;
                        gap: 20px;
                        padding: 0 20px 20px;
                        scrollbar-width: thin;
                        scrollbar-color: #00ffff rgba(255,255,255,0.1);
                    }
                    .wof-scroll-container::-webkit-scrollbar {
                        height: 6px;
                    }
                    .wof-scroll-container::-webkit-scrollbar-track {
                        background: rgba(255,255,255,0.05);
                    }
                                        @media (max-width: 768px) {
                        .wof-scroll-container {
                            flex-direction: column;
                            overflow-x: hidden;
                        }
                        .wof-island-group {
                            min-width: 100%;
                            flex: auto;
                            margin-bottom: 20px;
                        }
                        .wof-card:hover {
                            transform: translateY(-2px);
                        }
                    }
                    .wof-scroll-container::-webkit-scrollbar-thumb {
                        background: #00ffff;
                        border-radius: 10px;
                    }
                    .wof-island-group {
                        display: flex;
                        flex-direction: column;
                        min-width: 380px;
                        flex: 1;
                        background: rgba(255,255,255,0.03);
                        border-radius: 16px;
                        padding: 20px;
                        border: 1px solid rgba(0, 255, 255, 0.1);
                    }
                    .wof-island-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                    }
                    .wof-island-name {
                        color: #00ffff;
                        font-size: 0.85rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin: 0;
                    }
                    .wof-update-tag {
                        font-size: 0.65rem;
                        color: rgba(255,255,255,0.5);
                    }
                    .wof-card {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: rgba(255,255,255,0.05);
                        padding: 10px;
                        border-radius: 12px;
                        margin-bottom: 8px;
                        transition: all 0.2s;
                    }
                    .wof-card:hover {
                        background: rgba(0, 255, 255, 0.08);
                        transform: translateX(5px);
                    }
                    .wof-rank-badge {
                        width: 24px;
                        height: 24px;
                        background: rgba(255, 215, 0, 0.2);
                        color: #ffd700;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.75rem;
                        font-weight: 700;
                        flex-shrink: 0;
                    }
                    .wof-user-avatar {
                        width: 36px;
                        height: 36px;
                        background: linear-gradient(135deg, #00ced1 0%, #1e90ff 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 0.85rem;
                        color: white;
                        flex-shrink: 0;
                    }
                    .wof-user-details {
                        flex: 1;
                    }
                    .wof-user-name {
                        color: white;
                        font-size: 0.85rem;
                        font-weight: 600;
                        margin: 0;
                    }
                    .wof-user-trips {
                        color: rgba(255,255,255,0.6);
                        font-size: 0.75rem;
                        margin: 0;
                    }
                    .wof-user-title {
                        font-size: 0.65rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-top: 2px;
                        display: inline-block;
                        padding: 2px 6px;
                        border-radius: 4px;
                    }
                    .title-1 { background: rgba(255, 215, 0, 0.1); color: #ffd700; border: 1px solid rgba(255, 215, 0, 0.2); }
                    .title-2 { background: rgba(0, 255, 255, 0.1); color: #00ffff; border: 1px solid rgba(0, 255, 255, 0.2); }
                    .title-3 { background: rgba(205, 127, 50, 0.1); color: #cd7f32; border: 1px solid rgba(205, 127, 50, 0.2); }
                    
                    /* Share functionality styles */
                    .wof-share-btn {
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 8px;
                        font-size: 0.85rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.3s;
                    }
                    .wof-share-btn:hover {
                        background: rgba(0, 255, 255, 0.2);
                        border-color: #00ffff;
                        color: #00ffff;
                        transform: translateY(-2px);
                    }
                    .wof-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.8);
                        backdrop-filter: blur(8px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        padding: 20px;
                        animation: fadeIn 0.3s ease;
                    }
                    .wof-modal {
                        background: rgba(30, 41, 59, 0.7);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(0, 255, 255, 0.2);
                        border-radius: 24px;
                        padding: 30px;
                        width: 100%;
                        max-width: 400px;
                        text-align: center;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 255, 0.1);
                        animation: slideUp 0.3s ease;
                    }
                    .wof-modal-title {
                        color: white;
                        font-family: 'Outfit', sans-serif;
                        font-size: 1.5rem;
                        margin-bottom: 20px;
                    }
                    .wof-share-options {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                    }
                    .wof-share-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        padding: 20px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 16px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .wof-share-item:hover {
                        background: rgba(0, 255, 255, 0.1);
                        border-color: #00ffff;
                        transform: scale(1.05);
                    }
                    .share-icon {
                        font-size: 1.5rem;
                    }
                    .share-label {
                        color: white;
                        font-size: 0.8rem;
                        font-weight: 500;
                    }
                    .close-modal-btn {
                        margin-top: 25px;
                        background: transparent;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: rgba(255, 255, 255, 0.7);
                        padding: 8px 24px;
                        border-radius: 100px;
                        cursor: pointer;
                        font-size: 0.85rem;
                    }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    @keyframes flashPulse {
                        0% { transform: scale(1); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); }
                        50% { transform: scale(1.05); box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6); }
                        100% { transform: scale(1); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); }
                    }
                    /* Micro-animations for AWE emotion */
                    .home-card-awe {
                        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                    }
                    .home-card-awe:hover {
                        transform: translateY(-12px) scale(1.02);
                        box-shadow: 0 20px 40px rgba(0,255,255,0.15), 0 0 20px rgba(0, 123, 255, 0.2);
                        border-color: rgba(0, 255, 255, 0.3);
                    }
                    .home-card-awe:hover .home-image {
                        transform: scale(1.15) rotate(1deg); /* Subtle dramatic zoom */
                        filter: brightness(1.1) contrast(1.1); /* Make colors pop */
                    }
                    .btn-awe-copy {
                        transition: all 0.3s !important;
                        background: linear-gradient(45deg, #0ea5e9, #2563eb) !important;
                        border: none !important;
                    }
                    .btn-awe-copy:hover {
                        transform: scale(1.05);
                        box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
                        letter-spacing: 1px;
                        background: linear-gradient(45deg, #2563eb, #0ea5e9) !important;
                    }
                    `}
                </style>
                <div className="section-header" style={{ padding: '0 20px', marginBottom: '20px', textAlign: 'center', position: 'relative' }}>
                    <h2 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>Wall of Fame - Top Travelers</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '5px 0 20px' }}>Meet our most frequent island explorers this month!</p>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="wof-share-btn" onClick={openShareModal}>
                            <i className="fas fa-share-alt"></i> Share This
                        </button>
                    </div>
                </div>

                <div className="wof-scroll-container">
                    {/* Kapas */}
                    <div className="wof-island-group">
                        <div className="wof-island-header">
                            <h3 className="wof-island-name">Pulau Kapas</h3>
                            <span className="wof-update-tag">Feb 2026</span>
                        </div>
                        {[
                            { name: "Ahmad Zaki", initials: "AZ", trips: 12, tale: "Found a hidden sea turtle resting spot on Trip #3." },
                            { name: "Fatimah Zahra", initials: "FZ", trips: 10, tale: "Completed a 4km island kayak run smoothly." },
                            { name: "John Doe", initials: "JD", trips: 9, tale: "Snorkeled alongside 5 reef sharks!" },
                        ].map((user, i) => {
                            const titles = ["Elite Ilander", "Ocean Guardian", "Legendary Wayfinder"];
                            return (
                                <div key={i} className="wof-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.15, pointerEvents: 'none' }}>
                                        <i className="fas fa-anchor" style={{ fontSize: '80px', color: '#00ffff' }}></i>
                                    </div>
                                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg viewBox="0 0 100 100" width="40" height="40" style={{ position: 'absolute', top: 0, left: 0 }}>
                                            {/* Outer decorative ring */}
                                            <circle cx="50" cy="50" r="46" fill="transparent" stroke={i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32'} strokeWidth="2" strokeDasharray="4 2" />
                                            {/* Inner solid ring */}
                                            <circle cx="50" cy="50" r="40" fill={i === 0 ? 'rgba(255, 215, 0, 0.15)' : i === 1 ? 'rgba(192, 192, 192, 0.15)' : 'rgba(205, 127, 50, 0.15)'} stroke={i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32'} strokeWidth="1.5" />
                                            {/* Compass/Star points */}
                                            <path d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z" fill={i === 0 ? 'rgba(255, 215, 0, 0.4)' : i === 1 ? 'rgba(192, 192, 192, 0.4)' : 'rgba(205, 127, 50, 0.4)'} />
                                        </svg>
                                        <span style={{
                                            position: 'relative',
                                            zIndex: 1,
                                            color: i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32',
                                            fontWeight: '900',
                                            fontSize: '1.2rem',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }}>{i + 1}</span>
                                    </div>
                                    <div className="wof-user-avatar">{user.initials}</div>
                                    <div className="wof-user-details">
                                        <p className="wof-user-name">{user.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p className="wof-user-trips">{user.trips} Trips</p>
                                            <span className={`wof-user-title title-${i + 1}`}>{titles[i]}</span>
                                        </div>
                                        {/* Tooltip Story */}
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#94a3b8',
                                            fontStyle: 'italic',
                                            marginTop: '6px',
                                            paddingTop: '6px',
                                            borderTop: '1px solid rgba(255,255,255,0.1)',
                                            lineHeight: '1.3'
                                        }}>
                                            "{user.tale}"
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Redang */}
                    <div className="wof-island-group">
                        <div className="wof-island-header">
                            <h3 className="wof-island-name">Pulau Redang</h3>
                            <span className="wof-update-tag">Feb 2026</span>
                        </div>
                        {[
                            { name: "James Bond", initials: "JB", trips: 15, tale: "Caught a 2kg giant squid during a heavy storm." },
                            { name: "Michelle Yeoh", initials: "MY", trips: 13, tale: "Discovered a massive coral garden untouched by crowds." },
                            { name: "Tony Fernandes", initials: "TF", trips: 11, tale: "Flew here just for the sunrise dive." },
                        ].map((user, i) => {
                            const titles = ["Elite Ilander", "Ocean Guardian", "Legendary Wayfinder"];
                            return (
                                <div key={i} className="wof-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.15, pointerEvents: 'none' }}>
                                        <i className="fas fa-anchor" style={{ fontSize: '80px', color: '#00ffff' }}></i>
                                    </div>
                                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg viewBox="0 0 100 100" width="40" height="40" style={{ position: 'absolute', top: 0, left: 0 }}>
                                            {/* Outer decorative ring */}
                                            <circle cx="50" cy="50" r="46" fill="transparent" stroke={i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32'} strokeWidth="2" strokeDasharray="4 2" />
                                            {/* Inner solid ring */}
                                            <circle cx="50" cy="50" r="40" fill={i === 0 ? 'rgba(255, 215, 0, 0.15)' : i === 1 ? 'rgba(192, 192, 192, 0.15)' : 'rgba(205, 127, 50, 0.15)'} stroke={i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32'} strokeWidth="1.5" />
                                            {/* Compass/Star points */}
                                            <path d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z" fill={i === 0 ? 'rgba(255, 215, 0, 0.4)' : i === 1 ? 'rgba(192, 192, 192, 0.4)' : 'rgba(205, 127, 50, 0.4)'} />
                                        </svg>
                                        <span style={{
                                            position: 'relative',
                                            zIndex: 1,
                                            color: i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32',
                                            fontWeight: '900',
                                            fontSize: '1.2rem',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }}>{i + 1}</span>
                                    </div>
                                    <div className="wof-user-avatar">{user.initials}</div>
                                    <div className="wof-user-details">
                                        <p className="wof-user-name">{user.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p className="wof-user-trips">{user.trips} Trips</p>
                                            <span className={`wof-user-title title-${i + 1}`}>{titles[i]}</span>
                                        </div>
                                        {/* Tooltip Story */}
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#94a3b8',
                                            fontStyle: 'italic',
                                            marginTop: '6px',
                                            paddingTop: '6px',
                                            borderTop: '1px solid rgba(255,255,255,0.1)',
                                            lineHeight: '1.3'
                                        }}>
                                            "{user.tale}"
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Perhentian */}
                    <div className="wof-island-group">
                        <div className="wof-island-header">
                            <h3 className="wof-island-name">Pulau Perhentian</h3>
                            <span className="wof-update-tag">Feb 2026</span>
                        </div>
                        {[
                            { name: "Steve Irwin", initials: "SI", trips: 20, tale: "Swam with a rare dugong early in the morning." },
                            { name: "Bear Grylls", initials: "BG", trips: 18, tale: "Survived 3 days using only local island tactics." },
                            { name: "Greta Thunberg", initials: "GT", trips: 16, tale: "Organized a 50-person beach cleanup." },
                        ].map((user, i) => {
                            const titles = ["Elite Ilander", "Ocean Guardian", "Legendary Wayfinder"];
                            return (
                                <div key={i} className="wof-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.15, pointerEvents: 'none' }}>
                                        <i className="fas fa-anchor" style={{ fontSize: '80px', color: '#00ffff' }}></i>
                                    </div>
                                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg viewBox="0 0 100 100" width="40" height="40" style={{ position: 'absolute', top: 0, left: 0 }}>
                                            {/* Outer decorative ring */}
                                            <circle cx="50" cy="50" r="46" fill="transparent" stroke={i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32'} strokeWidth="2" strokeDasharray="4 2" />
                                            {/* Inner solid ring */}
                                            <circle cx="50" cy="50" r="40" fill={i === 0 ? 'rgba(255, 215, 0, 0.15)' : i === 1 ? 'rgba(192, 192, 192, 0.15)' : 'rgba(205, 127, 50, 0.15)'} stroke={i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32'} strokeWidth="1.5" />
                                            {/* Compass/Star points */}
                                            <path d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z" fill={i === 0 ? 'rgba(255, 215, 0, 0.4)' : i === 1 ? 'rgba(192, 192, 192, 0.4)' : 'rgba(205, 127, 50, 0.4)'} />
                                        </svg>
                                        <span style={{
                                            position: 'relative',
                                            zIndex: 1,
                                            color: i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32',
                                            fontWeight: '900',
                                            fontSize: '1.2rem',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }}>{i + 1}</span>
                                    </div>
                                    <div className="wof-user-avatar">{user.initials}</div>
                                    <div className="wof-user-details">
                                        <p className="wof-user-name">{user.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p className="wof-user-trips">{user.trips} Trips</p>
                                            <span className={`wof-user-title title-${i + 1}`}>{titles[i]}</span>
                                        </div>
                                        {/* Tooltip Story */}
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#94a3b8',
                                            fontStyle: 'italic',
                                            marginTop: '6px',
                                            paddingTop: '6px',
                                            borderTop: '1px solid rgba(255,255,255,0.1)',
                                            lineHeight: '1.3'
                                        }}>
                                            "{user.tale}"
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Achievement Card */}
                    <div className="wof-island-group" style={{
                        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${clipperShipImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderStyle: 'dashed',
                        minWidth: '220px',
                        flex: '0 0 220px',
                        marginLeft: 'auto',
                        padding: '10px'
                    }}>
                        <i className="fas fa-trophy" style={{ color: '#ffd700', fontSize: '1.5rem', marginBottom: '10px' }}></i>
                        <h3 style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 5px' }}>Unlock Rewards</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', margin: 0 }}>Be in the Top 3 to unlock<br />10% discount!</p>
                    </div>
                </div>
                {/* Share Modal */}
                {showShareModal && (
                    <div className="wof-modal-overlay" onClick={closeShareModal}>
                        <div className="wof-modal" onClick={e => e.stopPropagation()}>
                            <h3 className="wof-modal-title">Share Wall of Fame</h3>
                            <div className="wof-share-options">
                                <div className="wof-share-item" onClick={() => handleShare('whatsapp')}>
                                    <i className="fab fa-whatsapp share-icon" style={{ color: '#25D366' }}></i>
                                    <span className="share-label">WhatsApp</span>
                                </div>
                                <div className="wof-share-item" onClick={() => handleShare('facebook')}>
                                    <i className="fab fa-facebook share-icon" style={{ color: '#1877F2' }}></i>
                                    <span className="share-label">Facebook</span>
                                </div>
                                <div className="wof-share-item" onClick={() => handleShare('twitter')}>
                                    <i className="fab fa-twitter share-icon" style={{ color: '#1DA1F2' }}></i>
                                    <span className="share-label">X (Twitter)</span>
                                </div>
                                <div className="wof-share-item" onClick={() => handleShare('copy')}>
                                    <i className="fas fa-link share-icon" style={{ color: '#00ffff' }}></i>
                                    <span className="share-label">Copy Link</span>
                                </div>
                            </div>
                            <button className="close-modal-btn" onClick={closeShareModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Ocean Fact Card */}
            <OceanFactCard />

            {/* Background Music */}
            <audio ref={audioRef} loop autoPlay>
                {/* Sila masukkan URL atau path muzik sebenar anda di sini */}
                <source src="/assets/audio/wave.m4a" type="audio/mp4" />
            </audio>

            {/* Music Control Container */}
            {isAudioVisible && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    padding: '8px 15px',
                    borderRadius: '30px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease'
                }}>
                    {/* Music Toggle Button */}
                    <button
                        onClick={toggleMusic}
                        style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            background: isPlaying ? 'rgba(0, 255, 255, 0.2)' : 'transparent',
                            border: 'none',
                            color: isPlaying ? '#00ffff' : 'rgba(255,255,255,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        className="hover-scale"
                        title={isPlaying ? "Pause Music" : "Play Music"}
                    >
                        <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
                    </button>

                    {/* Volume Slider */}
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                            width: '80px',
                            cursor: 'pointer',
                            accentColor: '#00ffff',
                            height: '4px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '2px',
                            outline: 'none'
                        }}
                        title="Volume Control"
                    />

                    {/* Close Button */}
                    <button
                        onClick={() => setIsAudioVisible(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '5px'
                        }}
                        title="Hide Audio Controls"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
