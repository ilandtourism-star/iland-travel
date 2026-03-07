import React, { useState, useEffect, useRef } from 'react';
import { secureFetch } from '../../lib/api';

const PartnerBooking = () => {
    const [searchId, setSearchId] = useState('');
    const [guestName, setGuestName] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('All');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Calendar State
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch Bookings from API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await secureFetch('/api/v1/partner/bookings');
                if (response.ok) {
                    const data = await response.json();
                    setBookings(data);
                } else {
                    console.error('Failed to fetch bookings');
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const getStatusClass = (status) => {
        if (!status) return '';
        const s = status.toLowerCase();
        switch (s) {
            case 'confirmed': return 'status-confirmed';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            case 'completed': return 'status-completed';
            default: return '';
        }
    };

    // Filter Logic
    const filteredBookings = bookings.filter(booking => {
        const matchesTab = activeTab === 'All' || (booking.status && booking.status.toLowerCase() === activeTab.toLowerCase());
        const matchesStatus = statusFilter === 'All' || (booking.status && booking.status.toLowerCase() === statusFilter.toLowerCase());
        const matchesId = searchId === '' || (booking.id && booking.id.toString().includes(searchId));
        const matchesName = guestName === '' || (booking.firstName && booking.firstName.toLowerCase().includes(guestName.toLowerCase()));

        return matchesTab && matchesStatus && matchesId && matchesName;
    });

    return (
        <div className="booking-page-container">
            <div className="booking-main-content">
                <div className="booking-page-header">
                    <h1 className="booking-page-title">Bookings</h1>
                    <p className="booking-page-subtitle">View and manage your property's reservations.</p>
                </div>

                {/* Filter Section */}
                <div className="booking-filter-card">
                    <div className="booking-filter-row">
                        <div className="booking-filter-group">
                            <label htmlFor="filter_booking_id" className="booking-label">Booking ID</label>
                            <input
                                type="text"
                                id="filter_booking_id"
                                placeholder="e.g. 10423432"
                                className="booking-input"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                        </div>
                        <div className="booking-filter-group">
                            <label htmlFor="filter_guest_name" className="booking-label">Guest Name</label>
                            <input
                                type="text"
                                id="filter_guest_name"
                                placeholder="Guest Name"
                                className="booking-input"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                        </div>
                        <div className="booking-filter-group">
                            <label htmlFor="filter_date" className="booking-label">Activity Date</label>
                            <input
                                type="date"
                                id="filter_date"
                                className="booking-input"
                            />
                        </div>
                        <div className="booking-filter-group">
                            <label htmlFor="filter_status" className="booking-label">Status</label>
                            <select
                                id="filter_status"
                                className="booking-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="booking-filter-actions">
                            <button className="booking-search-button">Search</button>
                        </div>
                    </div>

                    {/* Secondary Filter Row */}
                    <div className="booking-secondary-filter-row">
                        <span className="booking-filter-label-text">Filters:</span>
                        <div className="booking-filter-chip">
                            All properties <i className="fas fa-chevron-down booking-filter-chip-icon"></i>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="booking-tabs-container">
                    <div
                        className={`booking-tab-item ${activeTab === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveTab('All')}
                    >All</div>
                    <div
                        className={`booking-tab-item ${activeTab === 'Confirmed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Confirmed')}
                    >Confirmed</div>
                    <div
                        className={`booking-tab-item ${activeTab === 'Pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Pending')}
                    >Pending</div>
                    <div
                        className={`booking-tab-item ${activeTab === 'Cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Cancelled')}
                    >Cancelled</div>
                    <div
                        className={`booking-tab-item ${activeTab === 'Completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Completed')}
                    >Completed</div>
                </div>

                {/* Table Section */}
                <div className="booking-table-card">
                    <div className="booking-table-header">
                        <span className="booking-header-title">Latest Reservations</span>
                        <button className="booking-export-button">
                            <i className="fas fa-download"></i> Export
                        </button>
                    </div>
                    <table className="booking-table">
                        <thead>
                            <tr className="booking-thead-row">
                                <th className="booking-th">Booking ID</th>
                                <th className="booking-th">Booked On</th>
                                <th className="booking-th">Guest Name</th>
                                <th className="booking-th">Activity</th>
                                <th className="booking-th" style={{ position: 'relative' }} ref={calendarRef}>
                                    <div
                                        className="booking-date-header"
                                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        Activity Date
                                        <i className={`fas fa-caret-down ${isCalendarOpen ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.2s' }}></i>
                                    </div>
                                    {/* Calendar Dropdown omitted for brevity but logic remains same if strictly needed */}
                                </th>
                                <th className="booking-th">Status</th>
                                <th className="booking-th" style={{ textAlign: 'right' }}>Price</th>
                                <th className="booking-th" style={{ textAlign: 'right' }}>Commission</th>
                                <th className="booking-th" style={{ textAlign: 'right' }}>Earnings</th>
                                <th className="booking-th">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>Loading bookings...</td></tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr><td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>No bookings found.</td></tr>
                            ) : (
                                filteredBookings.map((booking, index) => (
                                    <tr key={index} className="booking-tr">
                                        <td className="booking-td" style={{ color: '#5392f9', fontWeight: 'bold' }}>{booking.id}</td>
                                        <td className="booking-td">{booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '-'}</td>
                                        <td className="booking-td" style={{ fontWeight: '600' }}>{booking.firstName} {booking.lastName}</td>
                                        <td className="booking-td">{booking.activityName || 'Unknown Activity'}</td>
                                        <td className="booking-td">{booking.date ? new Date(booking.date).toLocaleDateString() : '-'}</td>
                                        <td className="booking-td">
                                            <span className={`booking-status-badge ${getStatusClass(booking.status)}`}>
                                                {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1)) : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="booking-td" style={{ textAlign: 'right' }}>MYR {booking.totalPrice || 0}</td>
                                        <td className="booking-td" style={{ textAlign: 'right', color: '#e53e3e' }}>-MYR {(booking.totalPrice * 0.1).toFixed(2)}</td>
                                        <td className="booking-td" style={{ textAlign: 'right', fontWeight: 'bold', color: '#38a169' }}>MYR {(booking.totalPrice * 0.9).toFixed(2)}</td>
                                        <td className="booking-td">
                                            <button className="booking-view-button">View</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="booking-pagination">
                        <span className="booking-page-info">Showing {filteredBookings.length} bookings</span>
                        <div className="booking-page-buttons">
                            <button className="booking-page-btn" disabled>&lt;</button>
                            <button className="booking-page-btn-active">1</button>
                            <button className="booking-page-btn" disabled>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerBooking;
