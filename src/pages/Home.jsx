import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

// --- Assets ---
import kapasImg from '../assets/images/kapas.png';
import redangImg from '../assets/images/redang.png';
import perhentianImg from '../assets/images/perhentian.png';
import homeHero from '../assets/images/home-hero.png';
import clipperShipImg from '../assets/images/clipper-ship-elite.png';

// Snorkeling Images
import kapasSnorkelImg from '../assets/images/kapas island/snorkeling.png';
import redangSnorkelImg from '../assets/images/Redang island/snorkeling2.png';
import perhentianSnorkelImg from '../assets/images/perhentian island/snorkeling.png';

// --- Components ---
import ActivityCard from '../components/common/ActivityCard';
import SEO from '../components/common/SEO';
import OceanFactCard from '../components/common/OceanFactCard';
import { getActivityLink } from '../utils/activityLinks';
import { fomoBookings, wallOfFameData, wofTitles } from '../data/homeData';

// Helper Map for images
const imageMap = {
    kapasSnorkelImg,
    redangSnorkelImg,
    perhentianSnorkelImg
};

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // --- State: Search & Navigation ---
    const [searchQuery, setSearchQuery] = useState('');

    // --- State: Audio / Music ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.05); // Default 5%
    const [isAudioVisible, setIsAudioVisible] = useState(true);
    const audioRef = useRef(null);

    // --- State: Environmental Triggers & FOMO ---
    const [isHotDay, setIsHotDay] = useState(false);
    const [isMonday, setIsMonday] = useState(false);
    const [recentBooking, setRecentBooking] = useState(null);

    // --- State: Activities & Flash Sales ---
    const initialActivitiesDynamic = [
        {
            id: 1, sku: 'joy-play-kapas', island: 'Kapas',
            title: "Snorkeling and island hopping in Kapas Island",
            rating: "5.0", reviews: 200, price: "69.00", originalPrice: "89.00",
            imageKey: 'kapasSnorkelImg', buttonText: "View Details", isFlashSale: true, totalSeats: 20, seatsLeft: 3
        },
        {
            id: 2, sku: 'snorkeling-redang', island: 'Redang',
            title: "Snorkeling in Redang Island",
            rating: "5.0", reviews: 250, price: "120.00", originalPrice: "160.00",
            imageKey: 'redangSnorkelImg', buttonText: "View Details", isFlashSale: true, totalSeats: 25, seatsLeft: 5
        },
        {
            id: 3, sku: 'snorkeling-perhentian', island: 'Perhentian',
            title: "Snorkeling in Perhentian Island",
            rating: "4.8", reviews: 156, price: "100.00", originalPrice: "135.00",
            imageKey: 'perhentianSnorkelImg', buttonText: "View Details", isFlashSale: true, totalSeats: 15, seatsLeft: 2
        },
    ];

    const activities = initialActivitiesDynamic.map(act => ({
        ...act,
        image: imageMap[act.imageKey],
        link: getActivityLink(act.sku, act.island),
        flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * (act.id === 1 ? 2.5 : act.id === 2 ? 4.2 : 1.8)).toISOString()
    }));
    const [dynamicActivities, setDynamicActivities] = useState(activities);

    // --- Logic: Audio Player ---
    useEffect(() => {
        const playMusic = async () => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (error) {
                    console.log("Autoplay blocked. Waiting for interaction.");
                    setIsPlaying(false);
                }
            }
        };

        playMusic();

        const handleFirstInteraction = () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
                window.removeEventListener('click', handleFirstInteraction);
            }
        };
        window.addEventListener('click', handleFirstInteraction);
        return () => window.removeEventListener('click', handleFirstInteraction);
    }, []);

    const toggleMusic = (e) => {
        if (e.target.type === 'range') return;
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => console.log("Audio failed:", error));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) audioRef.current.volume = newVolume;
    };

    // --- Logic: Flash Sales Sync ---
    useEffect(() => {
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

    // --- Logic: Modal & Back Button Trap ---
    const isShareModalOpen = searchParams.get('modal') === 'share';

    const openShareModal = () => {
        setSearchParams({ modal: 'share' });
        window.history.pushState({ modal: 'share' }, "");
    };

    const closeShareModal = () => {
        if (isShareModalOpen) {
            if (window.history.state?.modal === 'share') {
                window.history.back();
            } else {
                setSearchParams({});
            }
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            if (isShareModalOpen) setSearchParams({});
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isShareModalOpen, setSearchParams]);

    // --- Logic: Search & Sharing ---
    const handleSearch = () => {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    const handleShare = (platform) => {
        const shareUrl = window.location.href;
        const shareText = "Check out the Wall of Fame on Iland! Malaysia's top travelers are here.";
        let url = '';
        switch (platform) {
            case 'whatsapp': url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`; break;
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`; break;
            case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`; break;
            case 'copy':
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
                return;
        }
        if (url) window.open(url, '_blank');
    };

    // --- Logic: Dynamic Triggers ---
    useEffect(() => {
        // Temperature Logic
        const hour = new Date().getHours();
        if (hour >= 11 && hour <= 16) setIsHotDay(true);

        // Monday Logic
        setIsMonday(new Date().getDay() === 1);

        // FOMO Toasts Logic
        const showToast = () => {
            const randomUser = fomoBookings[Math.floor(Math.random() * fomoBookings.length)];
            setRecentBooking(randomUser);
            setTimeout(() => setRecentBooking(null), 5000);
            setTimeout(showToast, Math.floor(Math.random() * 15000) + 15000);
        };
        const initialTimer = setTimeout(showToast, 10000);
        return () => clearTimeout(initialTimer);
    }, []);

    const skinDiveActivities = useMemo(() => [
        {
            id: 101, sku: 'skin-dive-redang', island: 'Redang',
            title: "2. REDANG SKIN DIVE EXPERIENCE",
            rating: "0.0", reviews: 0, price: "250.00", originalPrice: "325.00",
            image: redangImg, buttonText: "Buy Now", isFlashSale: true, totalSeats: 20, seatsLeft: 3,
            link: "/redang-island-day-trips",
            description: "\"Too deep for snorkelers, too light for freedivers --perfect for those who prefer a light and relaxing dive.\" Spots: Pulau Lima, Coral Cave / Gua Kawah, Pulau Paku, Turtle Point, Marine Park. Itinerary: 8:00 AM-Board boat, 9:30 AM-Dive session 1, 12:00 PM-Lunch break, 1:00 PM-Dive session 2, 4:00 PM-Return to jetty.",
            features: [
                "Return boat transfer",
                "Guide / Safety Supervision",
                "Basic Skin Dive Coaching",
                "Lunch & Mineral Water",
                "Underwater Footage (Personal Video)",
                "Bring own mask/snorkel/fins (Weight & MP fee not included)"
            ],
            flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 2.5).toISOString()
        },
        {
            id: 102, sku: 'skin-dive-perhentian', island: 'Perhentian',
            title: "PERHENTIAN SKIN DIVE EXPERIENCE",
            rating: "0.0", reviews: 0, price: "270.00", originalPrice: "351.00",
            image: perhentianImg, buttonText: "Buy Now", isFlashSale: true, totalSeats: 20, seatsLeft: 3,
            link: "/perhentian-island-day-trips",
            description: "\"Too deep for snorkelers, too light for freedivers perfect for those who prefer a light and relaxing dive.\" Spots: Tiga Ruang (Warm up), Turtle Point, Nemo Point (Nemo & Cave), Coral Garden (Depth training), Shark Point (Cave).",
            features: [
                "Return boat transfer",
                "Guide / Safety Supervision",
                "Basic Skin Dive Coaching",
                "Underwater Footage (Personal Video)",
                "Marine Park Fee included",
                "Bring your own mask/snorkel/fins (Weight & lunch not info/provided)"
            ],
            flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 4.2).toISOString()
        }
    ], []);

    const freeDiveActivities = useMemo(() => [
        {
            id: 201, sku: 'free-dive-perhentian', island: 'Perhentian',
            title: "PERHENTIAN FREE DIVING DAYTRIP",
            rating: "0.0", reviews: 0, price: "300.00", originalPrice: "400.00",
            image: perhentianImg, buttonText: "Buy Now", isFlashSale: true, totalSeats: 15, seatsLeft: 2,
            link: "/perhentian-island-day-trips",
            description: "Push your limits with a free diving daytrip in the deep blue waters of Perhentian Island.",
            features: [
                "Return boat transfer",
                "Certified Free Dive Guide",
                "Advanced Depth Training",
                "Underwater Footage",
                "Marine Park Fee included"
            ],
            flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 3.5).toISOString()
        },
        {
            id: 202, sku: 'free-dive-redang', island: 'Redang',
            title: "REDANG FREE DIVING DAYTRIP",
            rating: "0.0", reviews: 0, price: "320.00", originalPrice: "420.00",
            image: redangImg, buttonText: "Buy Now", isFlashSale: true, totalSeats: 15, seatsLeft: 4,
            link: "/redang-island-day-trips",
            description: "Explore the serene depths of Redang Island with our exclusive free diving experience.",
            features: [
                "Return boat transfer",
                "Certified Free Dive Guide",
                "Coral Reef Exploration",
                "Underwater Footage",
                "Lunch Included"
            ],
            flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 5.1).toISOString()
        }
    ], []);

    const learningActivities = useMemo(() => [
        {
            id: 301, sku: 'course-skindiving', island: 'Perhentian',
            title: "LEARN SKINDIVING COURSE",
            rating: "5.0", reviews: 12, price: "450.00", originalPrice: "600.00",
            image: perhentianImg, buttonText: "View Details", isFlashSale: false, totalSeats: 10, seatsLeft: 5,
            link: "/search?q=skindiving",
            description: "Master the basics of skindiving and explore the ocean freely. Perfect for beginners who want to build confidence in the water.",
            features: [
                "Pool & Open Water Sessions",
                "Certified Instructor",
                "Full Equipment Provided",
                "Digital Certificate upon completion"
            ]
        }
    ], []);

    // --- RENDERING ---
    return (
        <div className="home-container">
            <SEO
                title="Home"
                description="Discover the best island activities in Malaysia including snorkeling, squid jigging, and private boat trips on Kapas, Redang, and Perhentian Islands."
                canonical="/"
            />

            {/* --- TOP BANNERS & TOSTS --- */}
            {isHotDay && (
                <div className="home-trigger-banner">
                    <i className="fas fa-temperature-high" style={{ fontSize: '1.2rem' }}></i>
                    <span>Tired of the heat? Escape to 26°C crystal clear waters today!</span>
                    <button className="home-trigger-btn" onClick={() => document.querySelector('.home-section-title').scrollIntoView({ behavior: 'smooth' })}>See Packages</button>
                    <button onClick={() => setIsHotDay(false)} className="home-trigger-close"><i className="fas fa-times"></i></button>
                </div>
            )}

            {recentBooking && (
                <div className="home-booking-toast">
                    <div className="home-toast-icon"><i className="fas fa-bell"></i></div>
                    <div className="home-toast-details">
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{recentBooking.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>Booked {recentBooking.act} <span style={{ color: '#ef4444', fontWeight: 'bold' }}>2 mins ago!</span></p>
                    </div>
                    <button onClick={() => setRecentBooking(null)} className="home-toast-close" title="Dismiss"><i className="fas fa-times"></i></button>
                </div>
            )}

            {/* --- HERO SECTION --- */}
            <div className="home-hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${homeHero})` }}>
                <div className="home-hero-content">
                    <h1 className="home-hero-title">
                        {isMonday ? "Monday Blues? Plan Your Escape." : "Discover Malaysia's Hidden Gems"}
                    </h1>
                    <p className="home-hero-subtitle">Experience the best island activities: Snorkeling, Squid Jigging, and Private Boat Trips.</p>

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

            {/* --- MAIN CONTENT --- */}
            <div className="home-content-wrapper">

                {/* Weather Widget */}
                <div className="home-weather-widget-container">
                    <div className="home-weather-inner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div className="weather-icon-container"><i className="fas fa-water"></i></div>
                            <div>
                                <h3 className="weather-text-header">East Coast Sea Conditions</h3>
                                <p className="weather-text-sub">Live Tide & Weather Advisory</p>
                            </div>
                        </div>
                        <div className="weather-info-group">
                            <div className="weather-info-item">
                                <p className="weather-info-label">Current Wave</p>
                                <p className="weather-info-value weather-info-value-calm"><i className="fas fa-check-circle"></i> Calm (0.5m)</p>
                            </div>
                            <div className="weather-desktop-only weather-info-item">
                                <p className="weather-info-label">Visibility</p>
                                <p className="weather-info-value weather-info-value-high"><i className="fas fa-eye"></i> High (15m+)</p>
                            </div>
                            <div className="weather-info-item">
                                <p className="weather-info-label">Verdict</p>
                                <span className="weather-verdict-badge">Perfect for Island Trips!</span>
                            </div>
                        </div>
                        <button onClick={() => alert("Copied to clipboard!")} className="weather-share-btn-cta">
                            <i className="fas fa-share-alt"></i> Share Status
                        </button>
                    </div>
                </div>

                {/* Island Destinations */}
                <div className="home-section" style={{ padding: '0', marginBottom: '60px' }}>
                    <h2 className="home-section-title">Popular Islands</h2>
                    <div className="home-grid">
                        {[
                            { id: 'kapas', name: 'Kapas Island', img: kapasImg, loc: 'Terengganu', desc: 'Crystal clear waters perfect for swimming & snorkeling.', path: '/kapas-island-day-trips', tags: [{ label: 'Snorkeling', link: '/kapas-snorkeling-details' }, { label: 'Private Boat', link: '/kapas-private-boat-details' }], btn: 'Activities List' },
                            { id: 'redang', name: 'Redang Island', img: redangImg, loc: 'Terengganu', desc: 'White sandy beaches and thriving marine parks.', path: '/redang-island-day-trips', tags: [{ label: 'Snorkeling', link: '/redang-snorkeling-details' }, { label: 'Squid Jigging', link: '/redang-squid-jigging-details' }], btn: 'Activities List' },
                            { id: 'perhentian', name: 'Perhentian Island', img: perhentianImg, loc: 'Terengganu', desc: 'A paradise for backpackers and nature lovers.', path: '/perhentian-island-day-trips', tags: [{ label: 'Snorkeling', link: '/perhentian-snorkeling-details' }], btn: 'Activities List' }
                        ].map(island => (
                            <Link key={island.id} to={island.path} className="home-card home-card-awe">
                                <div className="home-image-container">
                                    <img src={island.img} alt={island.name} className="home-image" style={{ transition: 'all 0.8s ease' }} />
                                    <div className="home-overlay"><span className="home-location-tag"><i className="fas fa-map-marker-alt"></i> {island.loc}</span></div>
                                </div>
                                <div className="home-card-content">
                                    <h3 className="home-card-title">{island.name}</h3>
                                    <p className="home-card-desc">{island.desc}</p>
                                    <div className="home-tag-container">
                                        {island.tags.map((tag, idx) => (
                                            <Link key={idx} to={tag.link} className="home-tag-link" onClick={e => e.stopPropagation()}>{tag.label}</Link>
                                        ))}
                                    </div>
                                    <span className="home-button btn-awe-copy">{island.btn}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Snorkeling Packages */}
                <div className="home-section" style={{ padding: '0' }}>
                    <h2 className="home-section-title">Top Snorkeling and Island Hopping Packages</h2>
                    <div className="home-grid">
                        {dynamicActivities.map(item => (
                            <ActivityCard key={item.id} {...item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- SKIN DIVE SECTION --- */}
            <div className="home-section" style={{ padding: '0', marginBottom: '60px' }}>
                <h2 className="home-section-title">Top SKIN DIVE Packages</h2>
                <div className="home-grid">
                    {skinDiveActivities.map(item => (
                        <ActivityCard key={item.id} {...item} />
                    ))}
                </div>
            </div>

            {/* --- FREE DIVING SECTION --- */}
            <div className="home-section" style={{ padding: '0', marginBottom: '60px' }}>
                <h2 className="home-section-title">Top FREE DIVING DAYTRIP Packages</h2>
                <div className="home-grid">
                    {freeDiveActivities.map(item => (
                        <ActivityCard key={item.id} {...item} />
                    ))}
                </div>
            </div>

            {/* --- LEARNING SECTION --- */}
            <div className="home-section" style={{ padding: '0', marginBottom: '60px' }}>
                <h2 className="home-section-title">Learning</h2>
                <div className="home-grid">
                    {learningActivities.map(item => (
                        <ActivityCard key={item.id} {...item} />
                    ))}
                </div>
            </div>

            {/* --- WALL OF FAME SECTION --- */}
            <div className="wof-scroll-section" style={{ background: '#0f172a', padding: '30px 0', borderBottom: '1px solid rgba(0, 255, 255, 0.1)' }}>
                <div className="home-wof-header">
                    <h2 className="home-wof-title">Wall of Fame - Top Travelers</h2>
                    <p className="home-wof-desc">Meet our most frequent island explorers this month!</p>
                    <div className="home-wof-share-wrapper">
                        <button className="wof-share-btn" onClick={openShareModal}><i className="fas fa-share-alt"></i> Share This</button>
                    </div>
                </div>

                <div className="wof-scroll-container">
                    {(wallOfFameData || []).map((group, groupIdx) => (
                        <div key={groupIdx} className="wof-island-group">
                            <div className="wof-island-header">
                                <h3 className="wof-island-name">{group.island}</h3>
                                <span className="wof-update-tag">{group.date}</span>
                            </div>
                            {group.users.map((user, i) => (
                                <div key={i} className="wof-card" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.15, pointerEvents: 'none' }}>
                                        <i className="fas fa-anchor" style={{ fontSize: '80px', color: '#00ffff' }}></i>
                                    </div>
                                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg viewBox="0 0 100 100" width="40" height="40" style={{ position: 'absolute', top: 0, left: 0 }}>
                                            <circle cx="50" cy="50" r="46" fill="transparent" stroke={i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32'} strokeWidth="2" strokeDasharray="4 2" />
                                            <circle cx="50" cy="50" r="40" fill={i === 0 ? 'rgba(255, 215, 0, 0.15)' : i === 1 ? 'rgba(192, 192, 192, 0.15)' : 'rgba(205, 127, 50, 0.15)'} stroke={i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32'} strokeWidth="1.5" />
                                            <path d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z" fill={i === 0 ? 'rgba(255, 215, 0, 0.4)' : i === 1 ? 'rgba(192, 192, 192, 0.4)' : 'rgba(205, 127, 50, 0.4)'} />
                                        </svg>
                                        <span style={{ position: 'relative', zIndex: 1, color: i === 0 ? '#ffd700' : i === 1 ? '#e5e4e2' : '#cd7f32', fontWeight: '900', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{i + 1}</span>
                                    </div>
                                    <div className="wof-user-avatar">{user.initials}</div>
                                    <div className="wof-user-details">
                                        <p className="wof-user-name">{user.name}</p>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p className="wof-user-trips">{user.trips} Trips</p>
                                            <span className={`wof-user-title title-${i + 1}`}>{wofTitles?.[i] || "Traveler"}</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.1)', lineHeight: '1.3' }}>"{user.tale}"</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Achievement Card */}
                    <div className="wof-island-group" style={{ background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${clipperShipImg})`, backgroundSize: 'cover', backgroundPosition: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed', minWidth: '220px', flex: '0 0 220px', marginLeft: 'auto', padding: '10px' }}>
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
                                {[
                                    { id: 'whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp', color: '#25D366' },
                                    { id: 'facebook', icon: 'fa-facebook', label: 'Facebook', color: '#1877F2' },
                                    { id: 'twitter', icon: 'fa-twitter', label: 'X (Twitter)', color: '#1DA1F2' },
                                    { id: 'copy', icon: 'fa-link', label: 'Copy Link', color: '#00ffff' }
                                ].map(option => (
                                    <div key={option.id} className="wof-share-item" onClick={() => handleShare(option.id)}>
                                        <i className={`fab ${option.icon} share-icon`} style={{ color: option.color }}></i>
                                        <span className="share-label">{option.label}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="close-modal-btn" onClick={closeShareModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- UTILITIES --- */}
            <OceanFactCard />

            <audio ref={audioRef} loop autoPlay>
                <source src="https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3" type="audio/mpeg" />
                <source src="/assets/audio/wave.m4a" type="audio/mp4" />
            </audio>

            {isAudioVisible && (
                <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.7)', padding: '8px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 255, 0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'all 0.3s ease' }}>
                    <button onClick={toggleMusic} style={{ width: '35px', height: '35px', borderRadius: '50%', background: isPlaying ? 'rgba(0, 255, 255, 0.2)' : 'transparent', border: 'none', color: isPlaying ? '#00ffff' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }} className="hover-scale" title={isPlaying ? "Pause" : "Play"}>
                        <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
                    </button>
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} style={{ width: '80px', cursor: 'pointer', accentColor: '#00ffff', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', outline: 'none' }} />
                    <button onClick={() => setIsAudioVisible(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem', marginLeft: '5px' }} title="Hide">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
