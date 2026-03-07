import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo/logo.svg';

const PartnerNavbar = () => {
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const mockProperties = [
        "All activities",
        "Snorkeling in Kapas",
        "Squid Jigging",
        "Sunset Cruise",
        "Island Hopping A",
        "Island Hopping B",
        "Private Boat 1",
        "Private Boat 2",
        "Fishing Trip",
        "Kayaking Adventure",
        "Jungle Trekking",
        "Beach BBQ"
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="partner-navbar">
            <div className="partner-navbar-left">
                {/* Brand Logo */}
                <Link to="/partner/activity-listing" className="partner-logo-link">
                    <div className="partner-logo-box">
                        <img src={logo} alt="Iland Logo" style={{ height: '24px' }} />
                        <span className="partner-platform-name">Iland Partner</span>
                    </div>
                </Link>

                {/* Vertical Divider */}
                <div className="partner-nav-divider"></div>

                {/* Property Switcher */}
                {/* Property Switcher */}
                <div className="partner-property-switcher-container" ref={dropdownRef}>
                    <div className="partner-property-switcher" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <i className="fas fa-th" style={{ fontSize: '16px', color: '#555' }}></i>
                        <span className="partner-property-text">All activities</span>
                        <i className={`fas fa-caret-down ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ fontSize: '12px', color: '#888', transition: 'transform 0.2s' }}></i>
                    </div>
                    {isDropdownOpen && (
                        <div className="partner-property-dropdown">
                            <div className="partner-property-list">
                                {mockProperties.map((prop, index) => (
                                    <div key={index} className="partner-property-item" onClick={() => setIsDropdownOpen(false)}>
                                        {prop}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Vertical Divider */}
                <div className="partner-nav-divider"></div>

                {/* Navigation Links moved to left */}
                <div className="partner-nav-links">
                    <Link
                        to="/partner/activity-listing"
                        className={`partner-nav-item ${location.pathname.includes('/partner/activity-listing') ? 'active' : ''}`}
                    >
                        Listings
                    </Link>
                    <Link
                        to="/partner/booking"
                        className={`partner-nav-item ${location.pathname.includes('/partner/booking') ? 'active' : ''}`}
                    >
                        Booking
                    </Link>
                    <Link
                        to="/partner/analytics"
                        className={`partner-nav-item ${location.pathname.includes('/partner/analytics') ? 'active' : ''}`}
                    >
                        Analytics
                    </Link>
                    <Link
                        to="/partner/payouts"
                        className={`partner-nav-item ${location.pathname.includes('/partner/payouts') ? 'active' : ''}`}
                    >
                        Payout accounts
                    </Link>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="partner-navbar-right">
                <div className="partner-help-icon">
                    <i className="far fa-question-circle"></i>
                </div>
                <div className="partner-user-profile">
                    <div className="partner-user-avatar">JD</div>
                </div>
            </div>
        </nav>
    );
};

export default PartnerNavbar;
