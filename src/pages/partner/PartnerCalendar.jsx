import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png'; // Mock image

const PartnerCalendar = () => {
    const navigate = useNavigate();
    // Start from current date
    const [startDate] = useState(new Date(2025, 1, 1)); // Feb 1, 2025
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 1, 14)); // Default select Feb 14

    // Mock Activity Data
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    // Generate 12 months from start date
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    });

    // Calendar Helper Functions
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendarDays = (dateForMonth) => {
        const year = dateForMonth.getFullYear();
        const month = dateForMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const daysArray = [];

        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            daysArray.push({ type: 'empty', key: `empty-${month}-${i}` });
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            // Mock data for each day (deterministic based on date to keep it consistent across renders)
            const pseudoRandom = (year * month * i) % 100 / 100;
            let status = 'available';
            let bookingsCount = 0;
            let slots = 5;

            if (pseudoRandom > 0.8) {
                status = 'blocked';
                slots = 0;
            } else if (pseudoRandom > 0.5) {
                status = 'booked';
                bookingsCount = Math.floor(pseudoRandom * 10) % 3 + 1;
                slots = Math.max(0, 5 - bookingsCount);
            }

            const date = new Date(year, month, i);
            const isSelected = selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

            daysArray.push({
                type: 'day',
                day: i,
                date: date,
                status,
                bookingsCount,
                slots,
                isSelected,
                key: `day-${month}-${i}`
            });
        }
        return daysArray;
    };

    const handleDayClick = (dayObj) => {
        if (dayObj.type !== 'empty') {
            setSelectedDate(dayObj.date);
        }
    };

    // Mock Bookings for Side Panel based on selection
    const getMockBookingsForDate = (date) => {
        if (!date) return [];
        const day = date.getDate();
        if (day % 3 === 0) return []; // Some days no bookings

        return [
            { id: 'BKG-102', guest: 'Sarah Lee', pax: '2 Adults', time: '09:00 AM', status: 'Confirmed', price: 'MYR 250' },
            { id: 'BKG-105', guest: 'Ahmad Albab', pax: '4 Adults, 2 Kids', time: '10:30 AM', status: 'Pending', price: 'MYR 550' }
        ];
    };

    const selectedBookings = getMockBookingsForDate(selectedDate);

    return (
        <>
            <ActivityNavbar
                activityName={activityData.name}
                activityId={activityData.id}
                activityImage={activityData.image}
            />
            <div className="activity-dashboard-container">
                <div className="dashboard-title-section">
                    <h1>Calendar & Availability</h1>
                    <p>Manage your availability and view daily bookings for the upcoming year.</p>
                </div>

                <div className="dashboard-overview-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 300px', alignItems: 'start', gap: '20px' }}>

                    {/* Left Column: Scrollable Calendar List */}
                    <div className="calendar-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                        {months.map((monthDate, index) => (
                            <div key={index} className="calendar-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                                {/* Month Header */}
                                <div className="calendar-header" style={{ marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                    <h2 className="card-title" style={{ margin: 0, fontSize: '1.2rem' }}>
                                        {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </h2>
                                </div>

                                {/* Calendar Grid */}
                                <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
                                    {/* Header Row */}
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="weekday-label" style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', background: '#f8f9fa', color: '#666' }}>{day}</div>
                                    ))}

                                    {/* Days */}
                                    {generateCalendarDays(monthDate).map((dayObj) => (
                                        <div
                                            key={dayObj.key}
                                            className={`calendar-day-cell ${dayObj.type === 'empty' ? 'empty-cell' : ''}`}
                                            style={{
                                                minHeight: '80px',
                                                alignItems: 'flex-start',
                                                justifyContent: 'flex-start',
                                                padding: '4px',
                                                border: dayObj.isSelected ? '2px solid #5392f9' : '1px solid #eee',
                                                background: dayObj.isSelected ? '#f0f7ff' : (dayObj.type === 'empty' ? '#fcfcfc' : 'white'),
                                                cursor: dayObj.type === 'empty' ? 'default' : 'pointer',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onClick={() => handleDayClick(dayObj)}
                                        >
                                            {dayObj.type !== 'empty' && (
                                                <>
                                                    <span className="day-number" style={{ fontSize: '0.85rem', fontWeight: '600', color: dayObj.status === 'blocked' ? '#aaa' : '#333' }}>
                                                        {dayObj.day}
                                                    </span>

                                                    <div style={{ marginTop: 'auto', width: '100%' }}>
                                                        {dayObj.status === 'blocked' ? (
                                                            <div style={{ background: '#f5f5f5', color: '#888', padding: '2px 4px', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <i className="fas fa-ban" style={{ fontSize: '0.7rem' }}></i> Blocked
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {dayObj.bookingsCount > 0 && (
                                                                    <div style={{ background: '#e6fffa', color: '#2c7a7b', padding: '2px 4px', borderRadius: '4px', fontSize: '0.7rem', marginBottom: '2px', border: '1px solid #b2f5ea', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                        {dayObj.bookingsCount} bookings
                                                                    </div>
                                                                )}
                                                                <div style={{ fontSize: '0.75rem', color: dayObj.slots === 0 ? '#e53e3e' : '#38a169', fontWeight: '500' }}>
                                                                    {dayObj.slots === 0 ? 'Full' : `${dayObj.slots} left`}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Side Panel (Sticky) */}
                    <div className="side-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '20px' }}>

                        {/* Selected Date Info */}
                        <div className="status-card" style={{ borderTop: '4px solid #5392f9' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h3>

                            {selectedBookings.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {selectedBookings.map((booking, idx) => (
                                        <div key={idx} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{booking.guest}</span>
                                                <span className={`badge-${booking.status.toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: booking.status === 'Confirmed' ? '#d1fae5' : '#fff7ed', color: booking.status === 'Confirmed' ? '#065f46' : '#9a3412' }}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                                                <i className="far fa-user" style={{ width: '16px' }}></i> {booking.pax}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                                                <i className="far fa-clock" style={{ width: '16px' }}></i> {booking.time}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333', marginTop: '8px', textAlign: 'right' }}>
                                                {booking.price}
                                            </div>
                                        </div>
                                    ))}
                                    <button className="btn-secondary" style={{ marginTop: '10px' }} onClick={() => navigate('/partner/booking')}>
                                        Manage Bookings
                                    </button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: '#666' }}>
                                    <i className="far fa-calendar-times" style={{ fontSize: '2rem', marginBottom: '12px', color: '#cbd5e0' }}></i>
                                    <p>No bookings for this date.</p>
                                    <button className="btn-action-primary" style={{ marginTop: '16px' }}>Add Manual Booking</button>
                                </div>
                            )}
                        </div>

                        {/* Quick Month Stats (Dynamic for selected date's month) */}
                        <div className="status-card">
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '16px', color: '#555' }}>
                                Stats: {selectedDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ color: '#666' }}>Occupancy</span>
                                <span style={{ fontWeight: '600', color: '#333' }}>68%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ color: '#666' }}>Total Bookings</span>
                                <span style={{ fontWeight: '600', color: '#333' }}>24</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#666' }}>Revenue</span>
                                <span style={{ fontWeight: '600', color: '#38a169' }}>MYR 4,200</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerCalendar;
