import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ActivityNavbar = ({ activityName, activityId, activityImage }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showPerformanceMenu, setShowPerformanceMenu] = useState(false);
    const [showCalendarMenu, setShowCalendarMenu] = useState(false);
    const [showRatesMenu, setShowRatesMenu] = useState(false);
    const [showActivityMenu, setShowActivityMenu] = useState(false);
    const [showFinanceMenu, setShowFinanceMenu] = useState(false);
    const [showResourcesMenu, setShowResourcesMenu] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    // Helper to check active tab using location.pathname
    const isActive = (path) => location.pathname === path;
    const navigateTo = (path) => { navigate(path); };

    return (
        <div className="activity-navbar">
            <div className="activity-navbar-left">
                <button className="btn-back-nav" onClick={() => navigateTo('/partner/activity-listing')}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div className="activity-nav-info">
                    <img src={activityImage} alt={activityName} className="nav-activity-thumb" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                        <div className="nav-activity-title">{activityName}</div>
                        <div className="nav-activity-id">ID: {activityId}</div>
                    </div>
                </div>
            </div>

            <div className="activity-navbar-tabs">

                <div
                    className={`nav-tab ${(isActive('/partner/analytics') || isActive('/partner/activity-dashboard') || showPerformanceMenu) ? 'active' : ''}`}
                    onMouseEnter={() => setShowPerformanceMenu(true)}
                    onMouseLeave={() => setShowPerformanceMenu(false)}
                    style={{ position: 'relative' }}
                >
                    Performance <i className="fas fa-chevron-down" style={{ fontSize: '0.7em', marginLeft: '6px' }}></i>

                    {showPerformanceMenu && (
                        <div className="nav-dropdown-menu">
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/activity-dashboard'); }}>
                                Dashboard
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/analytics'); }}>
                                Analytics
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/guest-reviews'); }}>
                                Guest Reviews
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={`nav-tab ${isActive('/partner/calendar') || showCalendarMenu ? 'active' : ''}`}
                    onMouseEnter={() => setShowCalendarMenu(true)}
                    onMouseLeave={() => setShowCalendarMenu(false)}
                    style={{ position: 'relative' }}
                >
                    Calendar <i className="fas fa-chevron-down" style={{ fontSize: '0.7em', marginLeft: '6px' }}></i>

                    {showCalendarMenu && (
                        <div className="nav-dropdown-menu">
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/calendar'); }}>
                                Calendar
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={`nav-tab ${isActive('/partner/booking') ? 'active' : ''}`}
                    onClick={() => navigateTo('/partner/booking')}
                >
                    Bookings
                </div>
                <div
                    className={`nav-tab ${isActive('/partner/pricing') || showRatesMenu ? 'active' : ''}`}
                    onMouseEnter={() => setShowRatesMenu(true)}
                    onMouseLeave={() => setShowRatesMenu(false)}
                    style={{ position: 'relative' }}
                >
                    Rates and availability <i className="fas fa-chevron-down" style={{ fontSize: '0.7em', marginLeft: '6px' }}></i>

                    {showRatesMenu && (
                        <div className="nav-dropdown-menu">
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/promotion'); }}>
                                Promotion
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/booking-settings'); }}>
                                Booking Settings
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/surcharges'); }}>
                                Surcharges
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/connectivity-settings'); }}>
                                Connectivity Settings
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={`nav-tab ${(isActive('/partner/activity-details') || isActive('/partner/equipment-service') || isActive('/partner/photos') || showActivityMenu) ? 'active' : ''}`}
                    onMouseEnter={() => setShowActivityMenu(true)}
                    onMouseLeave={() => setShowActivityMenu(false)}
                    style={{ position: 'relative' }}
                >
                    Activity <i className="fas fa-chevron-down" style={{ fontSize: '0.7em', marginLeft: '6px' }}></i>

                    {showActivityMenu && (
                        <div className="nav-dropdown-menu">
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/activity-details'); }}>
                                Activity Setup
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/equipment-service'); }}>
                                Equipment & services
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/photos'); }}>
                                Photos
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/arrival-guide'); }}>
                                Arrival guide
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={`nav-tab ${(isActive('/partner/payouts') || showFinanceMenu) ? 'active' : ''}`}
                    onMouseEnter={() => setShowFinanceMenu(true)}
                    onMouseLeave={() => setShowFinanceMenu(false)}
                    style={{ position: 'relative' }}
                >
                    Finance <i className="fas fa-chevron-down" style={{ fontSize: '0.7em', marginLeft: '6px' }}></i>

                    {showFinanceMenu && (
                        <div className="nav-dropdown-menu">
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/payouts'); }}>
                                Payouts
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/transactions'); }}>
                                All Transactions
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/past-payouts'); }}>
                                Past Payouts
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/payout-settings'); }}>
                                Payout and tax settings
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/compensation'); }}>
                                Contracted compensation
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={`nav-tab ${(showResourcesMenu) ? 'active' : ''}`}
                    onMouseEnter={() => setShowResourcesMenu(true)}
                    onMouseLeave={() => setShowResourcesMenu(false)}
                    style={{ position: 'relative' }}
                >
                    Resources <i className="fas fa-chevron-down" style={{ fontSize: '0.7em', marginLeft: '6px' }}></i>

                    {showResourcesMenu && (
                        <div className="nav-dropdown-menu">
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/contracts'); }}>
                                Contracts
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/privacy-policy'); }}>
                                Privacy Policy
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={`nav-tab ${(showSettingsMenu) ? 'active' : ''}`}
                    onMouseEnter={() => setShowSettingsMenu(true)}
                    onMouseLeave={() => setShowSettingsMenu(false)}
                    style={{ position: 'relative' }}
                >
                    Settings <i className="fas fa-chevron-down" style={{ fontSize: '0.7em', marginLeft: '6px' }}></i>

                    {showSettingsMenu && (
                        <div className="nav-dropdown-menu">
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/compliance-center'); }}>
                                Compliance Center
                            </div>
                            <div className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); navigateTo('/partner/user-management'); }}>
                                User Management
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="activity-navbar-actions">
                <button className="btn-preview" onClick={() => window.open('/kapas-island-day-trips', '_blank')}>
                    <i className="fas fa-external-link-alt"></i> Preview
                </button>
            </div>
        </div>
    );
};

export default ActivityNavbar;

