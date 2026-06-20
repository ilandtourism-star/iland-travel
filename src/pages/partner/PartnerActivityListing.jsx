
import React, { useState, useEffect, useRef } from 'react';
// Link and useNavigate removed due to crash issues
// import { Link, useNavigate } from 'react-router-dom';

// Import images from assets
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';
import imgSnorkelKapas from '../../assets/images/kapas island/snorkeling.png';
import imgSnorkelPerhentian from '../../assets/images/perhentian island/10.png';
import imgSnorkelRedang from '../../assets/images/Redang island/snorkeling.png';
import imgSquidJigging from '../../assets/images/Squid Jigging/family.png';
import { useToast } from '../../components/common/Toast';
import { secureFetch } from '../../lib/api';
import { Users, Save } from 'lucide-react';

const activitiesReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case 'SET_CAPACITY':
            return {
                ...state,
                data: state.data.map(item =>
                    item.sku === action.payload.sku ? { ...item, max_pax: action.payload.value } : item
                ),
            };
        default:
            throw new Error();
    }
};

const PartnerActivityListing = () => {
    const { success, error } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(null);
    const filterRefs = useRef([]);
    // State for action menu
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    // const navigate = useNavigate(); // Removed

    // Mock data for filters
    const mockFilters = {
        status: ["All", "Active", "Inactive", "Delist (Closed)", "Pending Review", "Draft"],
        countries: ["All countries", "Malaysia", "Thailand", "Indonesia", "Vietnam", "Philippines", "Singapore", "Cambodia", "Laos", "Myanmar", "Brunei"],
        cities: ["All cities", "Kapas Island", "Redang Island", "Perhentian Island", "Lang Tengah", "Tioman", "Rawa Island", "Sibu Island", "Besar Island", "Tinggi Island", "Aur Island"]
    };

    const toggleFilter = (filterName) => {
        if (activeFilter === filterName) {
            setActiveFilter(null);
        } else {
            setActiveFilter(filterName);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close filters
            if (filterRefs.current && !filterRefs.current.some(ref => ref && ref.contains(event.target))) {
                setActiveFilter(null);
            }
            // Close action menu
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        if (activeMenu === id) {
            setActiveMenu(null);
        } else {
            setActiveMenu(id);
        }
    };

    const handleMenuAction = (action, activity) => {
        console.log(`Action: ${action} for activity ${activity.id}`);
        setActiveMenu(null);

        switch (action) {
            case 'dashboard':
                window.location.href = '/partner/activity-dashboard';
                break;
            case 'calendar':
                window.location.href = '/partner/calendar';
                break;
            case 'booking':
                window.location.href = '/partner/booking';
                break;
            case 'message':
                window.location.href = '/partner/messaging';
                break;
            case 'view':
                // Assuming public pages have a consistent naming convention or mapping
                // For now, redirecting to a search result or specific page if known
                // Simple logic: navigate to /Kapas Island Day Trips as a placeholder or proper detail page if exists
                window.location.href = '/kapas-island-day-trips';
                break;
            default:
                break;
        }
    };

    // State for activities using useReducer
    const [activities, dispatchActivities] = React.useReducer(activitiesReducer, {
        data: [],
        isLoading: true,
        isError: false,
    });

    // Fetch Activities
    useEffect(() => {
        const fetchActivities = async () => {
            dispatchActivities({ type: 'FETCH_INIT' });
            try {
                const response = await secureFetch('/api/v1/partner/activities');
                if (response.ok) {
                    const data = await response.json();
                    // Enhance data with mock status/revenue/score if missing from DB for now
                    const enhancedData = data.map(item => ({
                        ...item,
                        id_display: item.sku,
                        status: 'Active', // Default to Active
                        revenue: 'MYR 0',
                        adr: 'MYR ' + (item.price || 0),
                        score: 'New',
                        image: item.image || imgPrivateBoat, // Fallback image
                        max_pax: item.max_pax || 12 // Existing or default
                    }));
                    dispatchActivities({ type: 'FETCH_SUCCESS', payload: enhancedData });
                } else {
                    console.error('Failed to fetch activities');
                    dispatchActivities({ type: 'FETCH_FAILURE' });
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
                dispatchActivities({ type: 'FETCH_FAILURE' });
            }
        };

        fetchActivities();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
        // Implement search logic here
    };

    const handleCapacityChange = (sku, value) => {
        dispatchActivities({ type: 'SET_CAPACITY', payload: { sku, value } });
    };

    const saveCapacity = async (sku, newCapacity) => {
        try {
            const response = await secureFetch(`/api/v1/vacation/${sku}/capacity`, {
                method: 'PUT',
                body: JSON.stringify({ max_pax: parseInt(newCapacity) })
            });

            if (response.ok) {
                success('Kapasiti berjaya dikemaskini!');
            } else {
                const data = await response.json();
                error(data.message || 'Gagal mengemaskini kapasiti');
            }
        } catch (err) {
            error('Ralat pelayan');
        }
    };

    return (
        <div className="listings-page-container">
            <style>{`
                .action-menu-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 160px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border: 1px solid #eee;
                    z-index: 100;
                    overflow: hidden;
                    animation: fadeIn 0.1s ease-out;
                }
                .action-menu-item {
                    display: block;
                    width: 100%;
                    padding: 10px 16px;
                    text-align: left;
                    background: none;
                    border: none;
                    font-size: 0.9rem;
                    color: #333;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .action-menu-item:hover {
                    background-color: #f5f7fa;
                    color: #5392f9;
                }
                .action-menu-item i {
                    width: 20px;
                    color: #888;
                    margin-right: 8px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Main Content Area */}
            <div className="listings-main-content">

                <div className="listings-page-header">
                    <div>
                        <h1 className="listings-page-title">Listings</h1>
                        <p className="listings-page-subtitle">Search and manage your registered activities.</p>
                    </div>
                    <a href="/partner/list-an-activity" className="listings-create-button">
                        <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                        List an activity
                    </a>
                </div>

                {/* Search and Filter Container */}
                <div className="listings-search-filter-container">
                    <form onSubmit={handleSearch} className="listings-search-form">
                        <div className="listings-search-group">
                            <i className="fas fa-search listings-search-icon"></i>
                            <input
                                type="text"
                                placeholder="e.g. 9001234 or Kapas Snorkeling"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="listings-search-input"
                            />
                        </div>
                    </form>

                    <div className="listings-filter-container">
                        <span className="listings-filter-label">Filters:</span>

                        {/* Status Filter */}
                        <div className="listings-filter-wrapper" ref={el => filterRefs.current[0] = el}>
                            <button className={`listings-filter-button ${activeFilter === 'status' ? 'active' : ''}`} onClick={() => toggleFilter('status')}>
                                Status <i className={`fas fa-chevron-down listings-filter-icon ${activeFilter === 'status' ? 'rotate-180' : ''}`}></i>
                            </button>
                            {activeFilter === 'status' && (
                                <div className="listings-filter-dropdown">
                                    <div className="listings-filter-list">
                                        {mockFilters.status.map((item, index) => (
                                            <div key={index} className="listings-filter-item" onClick={() => setActiveFilter(null)}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Country Filter */}
                        <div className="listings-filter-wrapper" ref={el => filterRefs.current[1] = el}>
                            <button className={`listings-filter-button ${activeFilter === 'country' ? 'active' : ''}`} onClick={() => toggleFilter('country')}>
                                All countries <i className={`fas fa-chevron-down listings-filter-icon ${activeFilter === 'country' ? 'rotate-180' : ''}`}></i>
                            </button>
                            {activeFilter === 'country' && (
                                <div className="listings-filter-dropdown">
                                    <div className="listings-filter-list">
                                        {mockFilters.countries.map((item, index) => (
                                            <div key={index} className="listings-filter-item" onClick={() => setActiveFilter(null)}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* City Filter */}
                        <div className="listings-filter-wrapper" ref={el => filterRefs.current[2] = el}>
                            <button className={`listings-filter-button ${activeFilter === 'city' ? 'active' : ''}`} onClick={() => toggleFilter('city')}>
                                All cities <i className={`fas fa-chevron-down listings-filter-icon ${activeFilter === 'city' ? 'rotate-180' : ''}`}></i>
                            </button>
                            {activeFilter === 'city' && (
                                <div className="listings-filter-dropdown">
                                    <div className="listings-filter-list">
                                        {mockFilters.cities.map((item, index) => (
                                            <div key={index} className="listings-filter-item" onClick={() => setActiveFilter(null)}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Activity List Table */}
                <div className="listings-table-container">
                    {/* Header Row */}
                    <div className="listings-table-header">
                        <div className="listings-header-cell" style={{ flex: 2 }}>Name <i className="fas fa-sort listings-sort-icon"></i></div>
                        <div className="listings-header-cell" style={{ flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>Revenue (MTD) <i className="fas fa-sort listings-sort-icon"></i></div>
                        <div className="listings-header-cell" style={{ flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>Avg daily rate (MTD) <i className="fas fa-sort listings-sort-icon"></i></div>
                        <div className="listings-header-cell" style={{ flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>Kapasiti (Max Pax)</div>
                        <div className="listings-header-cell" style={{ flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>Content score <i className="fas fa-sort listings-sort-icon"></i></div>
                    </div>

                    {/* Data Rows */}
                    {activities.isLoading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading activities...</div>
                    ) : activities.isError ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Sesuatu telah berlaku semasa memuatkan aktiviti ...</div>
                    ) : activities.data.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>No activities found. List one now!</div>
                    ) : (
                        activities.data.map((activity) => (
                            <div key={activity.sku || activity.id} className="listings-table-row" onClick={(e) => {
                                // Prevent navigation if clicking on menu or dropdown
                                if (e.target.closest('.fas.fa-ellipsis-v') || e.target.closest('.action-menu-dropdown')) return;
                                window.location.href = '/partner/activity-dashboard';
                            }} style={{ cursor: 'pointer' }}>
                                <div className="listings-cell" style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <img src={activity.image} alt={activity.name} className="listings-activity-thumbnail" />
                                    <div>
                                        <div className="listings-activity-name">
                                            {activity.name}
                                            {activity.status.includes('Delist') && <span className="listings-status-label-closed">(closed)</span>}
                                            {activity.status.includes('Inactive') && <span className="listings-status-label-closed">(inactive)</span>}
                                        </div>
                                        <div className="listings-activity-meta">
                                            <span className={activity.status === 'Active' ? 'listings-status-active' : 'listings-status-inactive'}>{activity.status.split(' ')[0]}</span>
                                            <span className="listings-meta-separator">•</span>
                                            <span>{activity.id_display}</span>
                                            <span className="listings-meta-separator">•</span>
                                            <span>{activity.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="listings-cell" style={{ flex: 1, textAlign: 'right', color: activity.revenue === 'N/A' ? '#ccc' : '#333' }}>{activity.revenue}</div>
                                <div className="listings-cell" style={{ flex: 1, textAlign: 'right', color: activity.adr === 'N/A' ? '#ccc' : '#333' }}>{activity.adr}</div>
                                <div className="listings-cell" style={{ flex: 1, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="number"
                                        value={activity.max_pax || 12}
                                        onChange={(e) => handleCapacityChange(activity.sku, e.target.value)}
                                        onClick={(e) => e.stopPropagation()} // Prevent row navigation
                                        style={{ width: '45px', padding: '4px', borderRadius: '4px', border: '1px solid #ddd', textAlign: 'center', fontSize: '13px' }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            saveCapacity(activity.sku, activity.max_pax);
                                        }}
                                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#5392f9' }}
                                        title="Simpan Kapasiti"
                                    >
                                        <Save size={16} />
                                    </button>
                                </div>
                                <div className="listings-cell" style={{ flex: 1, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', position: 'relative' }}>
                                    <span>{activity.score}</span>
                                    <div style={{ position: 'relative' }} ref={activeMenu === activity.id ? menuRef : null}>
                                        <i
                                            className="fas fa-ellipsis-v"
                                            style={{ color: '#888', cursor: 'pointer', marginLeft: '8px', padding: '8px' }}
                                            onClick={(e) => toggleMenu(e, activity.id)}
                                        ></i>
                                        {activeMenu === activity.id && (
                                            <div className="action-menu-dropdown">
                                                <button className="action-menu-item" onClick={() => handleMenuAction('dashboard', activity)}>
                                                    <i className="fas fa-chart-line"></i> Dashboard
                                                </button>
                                                <button className="action-menu-item" onClick={() => handleMenuAction('calendar', activity)}>
                                                    <i className="fas fa-calendar-alt"></i> Calendar
                                                </button>
                                                <button className="action-menu-item" onClick={() => handleMenuAction('booking', activity)}>
                                                    <i className="fas fa-book-open"></i> Booking
                                                </button>
                                                <button className="action-menu-item" onClick={() => handleMenuAction('message', activity)}>
                                                    <i className="fas fa-envelope"></i> Message
                                                </button>
                                                <button className="action-menu-item" onClick={() => handleMenuAction('view', activity)}>
                                                    <i className="fas fa-external-link-alt"></i> View Page
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>

                {/* Pagination Controls */}
                <div className="listings-pagination-container">
                    <div className="listings-rows-per-page">
                        <span>Show</span>
                        <select className="listings-page-select">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <div className="listings-page-navigation">
                        <button className="listings-page-nav-button" disabled><i className="fas fa-chevron-left"></i></button>
                        <button className="listings-page-nav-button-active">1</button>
                        <button className="listings-page-nav-button" disabled><i className="fas fa-chevron-right"></i></button>
                    </div>
                </div>

            </div >

            {/* Simple Footer */}
            < footer className="listings-footer" >
                <p>&copy; 2025 ilaand. All rights reserved.</p>
                <div className="listings-footer-links">
                    <a href="/terms" style={{ color: '#5392f9', textDecoration: 'none' }}>Terms of Use</a>
                    <a href="/privacy" style={{ color: '#5392f9', textDecoration: 'none' }}>Privacy Policy</a>
                </div>
            </footer >
        </div >
    );
};

export default PartnerActivityListing;
