import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

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
    const [volume, setVolume] = useState(0.05); // Default volume level 5% (Very subtle background)
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
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();


    // --- NATIVE POPSTATE TRAP FOR REALME / ANDROID BACK BUTTON ---
    const isShareModalOpen = searchParams.get('modal') === 'share';

    const openShareModal = () => {
        // 1. Update URL visually for links/consistency
        setSearchParams({ modal: 'share' });
        // 2. Push a fake state to the browser history to TRAP the next back button press
        window.history.pushState({ modal: 'share' }, "");
    };

    const closeShareModal = () => {
        if (isShareModalOpen) {
            // If we are closing via UI (X button), we need to clear the fake history entry
            if (window.history.state?.modal === 'share') {
                window.history.back();
            } else {
                setSearchParams({});
            }
        }
    };

    // Global listener to catch the "Back" button event
    useEffect(() => {
        const handlePopState = (event) => {
            if (isShareModalOpen) {
                // We caught the back button! Close the modal and stay on page.
                setSearchParams({});
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isShareModalOpen, setSearchParams]);

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
                <div className="home-trigger-banner">
                    <i className="fas fa-temperature-high" style={{ fontSize: '1.2rem' }}></i>
                    <span>Tired of the heat? Escape to 26°C crystal clear waters today!</span>
                    <button className="home-trigger-btn" onClick={() => document.querySelector('.home-section-title').scrollIntoView({ behavior: 'smooth' })}>
                        See Packages
                    </button>
                    <button onClick={() => setIsHotDay(false)} className="home-trigger-close">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            {/* FOMO Live Booking Toast */}
            {recentBooking && (
                <div className="home-booking-toast">
                    <div className="home-toast-icon">
                        <i className="fas fa-bell"></i>
                    </div>
                    <div className="home-toast-details">
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{recentBooking.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>Booked {recentBooking.act} <span style={{ color: '#ef4444', fontWeight: 'bold' }}>2 mins ago!</span></p>
                    </div>

                    {/* Close Toast Button */}
                    <button
                        onClick={() => setRecentBooking(null)}
                        className="home-toast-close"
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
                    <div className="search-container home-search-wrapper">
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
            <div className="home-content-wrapper">

                {/* Practical Value: Live Weather & Tide Status Widget */}
                <div className="home-weather-widget-container">
                    <div className="home-weather-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div className="weather-icon-container">
                                <i className="fas fa-water"></i>
                            </div>
                            <div>
                                <h3 className="weather-text-header">East Coast Sea Conditions</h3>
                                <p className="weather-text-sub">Live Tide & Weather Advisory</p>
                            </div>
                        </div>

                        <div className="weather-info-group">
                            <div className="weather-info-item">
                                <p className="weather-info-label">Current Wave</p>
                                <p className="weather-info-value weather-info-value-calm">
                                    <i className="fas fa-check-circle"></i> Calm (0.5m)
                                </p>
                            </div>
                            <div className="weather-desktop-only weather-info-item">
                                <p className="weather-info-label">Visibility</p>
                                <p className="weather-info-value weather-info-value-high">
                                    <i className="fas fa-eye"></i> High (15m+)
                                </p>
                            </div>
                            <div className="weather-info-item">
                                <p className="weather-info-label">Verdict</p>
                                <span className="weather-verdict-badge">
                                    Perfect for Island Trips!
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={() => alert("Copied to clipboard! Share the good news with your travel buddies.")} 
                            className="weather-share-btn-cta"
                        >
                            <i className="fas fa-share-alt"></i> Share Status
                        </button>
                    </div>
                </div>

                {/* Popular Destinations */}
                <div className="home-section" style={{ padding: '0', marginBottom: '60px' }}>
                    <h2 className="home-section-title">Breathtaking Island Escapes</h2>
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
                <div className="home-wof-header">
                    <h2 className="home-wof-title">Wall of Fame - Top Travelers</h2>
                    <p className="home-wof-desc">Meet our most frequent island explorers this month!</p>

                    <div className="home-wof-share-wrapper">
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
                {isShareModalOpen && (
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
                {/* Menggunakan URL remote untuk memastikan audio berfungsi di Render tanpa memuat naik fail besar (626MB) */}
                <source src="https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3" type="audio/mpeg" />
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
