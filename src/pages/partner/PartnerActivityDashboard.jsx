import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import { useToast } from '../../components/common/Toast';
import { secureFetch } from '../../lib/api';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png'; // Mock image

const PartnerActivityDashboard = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1)); // Feb 1, 2025
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [monthlyAvailability, setMonthlyAvailability] = useState({});
    const [loadingCalendar, setLoadingCalendar] = useState(false);

    // Fetch Dashboard Data & Activities
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/auth');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const response = await secureFetch('/api/v1/partner/dashboard', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    const bookingsResponse = await secureFetch('/api/v1/partner/bookings', { credentials: 'include' });
                    let recentBookings = [];
                    if (bookingsResponse.ok) {
                        const allBookings = await bookingsResponse.json();
                        recentBookings = allBookings.slice(0, 5);
                    }
                    setDashboardData({ ...data, recentBookings });
                }

                // Fetch real activities
                const activitiesRes = await secureFetch('/api/v1/partner/activities', { credentials: 'include' });
                if (activitiesRes.ok) {
                    const data = await activitiesRes.json();
                    setActivities(data);
                    if (data.length > 0) {
                        setSelectedActivity(data[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Fetch Availability for the selected month
    useEffect(() => {
        if (!selectedActivity) return;

        const fetchMonthAvailability = async () => {
            setLoadingCalendar(true);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = getDaysInMonth(year, month);
            const availabilityMap = {};

            try {
                const promises = [];
                for (let i = 1; i <= daysInMonth; i++) {
                    const dateStr = new Date(year, month, i).toISOString().split('T')[0];
                    promises.push(
                        secureFetch(`/api/v1/booking/availability/${selectedActivity.sku}/${dateStr}`)
                            .then(res => res.json())
                            .then(data => {
                                availabilityMap[dateStr] = data.remaining_pax;
                            })
                    );
                }
                await Promise.all(promises);
                setMonthlyAvailability(availabilityMap);
            } catch (err) {
                console.error("Error fetching calendar availability:", err);
            } finally {
                setLoadingCalendar(false);
            }
        };

        fetchMonthAvailability();
    }, [selectedActivity, currentDate]);

    // Generate Calendar Data
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const daysArray = [];

        // Empty slots for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            daysArray.push({ type: 'empty', key: `empty-${i}` });
        }

        // Available days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i);
            const dateStr = dateObj.toISOString().split('T')[0];
            const slots = monthlyAvailability[dateStr] !== undefined ? monthlyAvailability[dateStr] : (selectedActivity?.max_pax || 12);

            let isSelected = false;
            let isRange = false;

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                dateObj.setHours(0, 0, 0, 0);

                if (dateObj.getTime() === start.getTime()) {
                    isSelected = true;
                }

                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(0, 0, 0, 0);
                    if (dateObj.getTime() === end.getTime()) {
                        isSelected = true;
                    }
                    if (dateObj > start && dateObj < end) {
                        isRange = true;
                    }
                }
            }

            daysArray.push({
                type: 'day',
                day: i,
                date: new Date(year, month, i),
                status: slots === 0 ? 'booked' : 'available',
                slots: slots,
                key: `day-${i}`,
                isSelected,
                isRange
            });
        }
        return daysArray;
    };

    const calendarDays = generateCalendarDays();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleStartDateChange = (e) => {
        const newDate = e.target.value;
        setStartDate(newDate);
        if (newDate) {
            // Jump calendar to the Start Date month
            const d = new Date(newDate);
            if (!isNaN(d.getTime())) {
                setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
            }
        }
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // Mock Data (Fallback)
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        status: 'Active', // or 'Delist'
        image: imgPrivateBoat,
        stats: {
            revenue: 'MYR 0', // Placeholder
            bookings: dashboardData ? dashboardData.bookings : 0,
            views: 0,
            rating: 0,
            viewsToday: 0,
            bookingsToday: 0
        }
    };

    const [selectedDay, setSelectedDay] = useState(null); // { day, slots, status }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSlotCount, setNewSlotCount] = useState(0);

    const { success } = useToast();

    const handleDayClick = (dayObj) => {
        if (dayObj.type === 'empty') return;
        setSelectedDay(dayObj);
        setNewSlotCount(dayObj.slots);
        // No longer using modal
    };

    const handleSaveSlots = async (dateStr, count) => {
        if (!selectedActivity) return;

        try {
            const response = await secureFetch(`/api/v1/booking/availability/${selectedActivity.sku}/${dateStr}`, {
                method: 'POST',
                body: JSON.stringify({ remaining_pax: parseInt(count) }),
                credentials: 'include'
            });

            if (response.ok) {
                success(`Berjaya dikemaskini: ${parseInt(count)} slot untuk ${dateStr}`);
                // Refresh local state
                setMonthlyAvailability(prev => ({ ...prev, [dateStr]: parseInt(count) }));
            } else {
                error('Gagal mengemaskini ketersediaan.');
            }
        } catch (err) {
            error('Ralat pelayan.');
        }
    };


    return (
        <>
            <ActivityNavbar
                activityName={selectedActivity?.name || activityData.name}
                activityId={selectedActivity?.sku || activityData.id}
                activityImage={selectedActivity?.image ? `https://localhost:5000${selectedActivity.image}` : activityData.image}
            />
            <div className="activity-dashboard-container">
                {/* Hero / Welcome Section */}
                <div className="dashboard-hero">
                    <div className="hero-welcome">
                        <h1>Selamat Datang, Partner!</h1>
                        <p>Inilah ringkasan prestasi aktiviti anda hari ini.</p>
                    </div>
                    <div className="hero-badge">
                        <span className="booking-status-pill status-active-premium">
                            <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i> Active Activity
                        </span>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="quick-actions-grid">
                    <div className="glass-card premium-stat-card">
                        <div className="stat-icon"><i className="fas fa-shopping-cart"></i></div>
                        <span className="stat-value">{dashboardData ? dashboardData.bookings : 0}</span>
                        <span className="stat-label">Total Bookings</span>
                    </div>
                    <div className="glass-card premium-stat-card">
                        <div className="stat-icon"><i className="fas fa-wallet" style={{ color: '#008f5d' }}></i></div>
                        <span className="stat-value">MYR {dashboardData ? dashboardData.revenue || 0 : 0}</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                    <div className="glass-card premium-stat-card">
                        <div className="stat-icon"><i className="fas fa-eye" style={{ color: '#667eea' }}></i></div>
                        <span className="stat-value">{activityData.stats.viewsToday}</span>
                        <span className="stat-label">Views Today</span>
                    </div>
                    <div className="glass-card premium-stat-card">
                        <div className="stat-icon"><i className="fas fa-star" style={{ color: '#fbbf24' }}></i></div>
                        <span className="stat-value">{activityData.stats.rating}</span>
                        <span className="stat-label">User Rating</span>
                    </div>
                </div>

                <div className="dashboard-main-grid">
                    <div className="main-col">
                        {/* Attention Card */}
                        <div className="attention-badge">
                            <i className="fas fa-bell"></i>
                            <div>
                                <strong>Tindakan Diperlukan:</strong> Anda mempunyai 1 ulasan baharu yang belum dibalas.
                            </div>
                        </div>

                        {/* Professional Availability Calendar */}
                        <div id="availability-calendar" className="glass-card" style={{ marginTop: '24px', padding: '24px' }}>
                            <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <div>
                                    <h2 className="card-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Ketersediaan Slot</h2>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#718096' }}>Tukar baki pax terus di dalam petak kalendar.</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button className="btn-icon" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} onClick={handlePrevMonth}>
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <span style={{ fontWeight: 600, minWidth: '140px', textAlign: 'center', fontSize: '1.1rem' }}>
                                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button className="btn-icon" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} onClick={handleNextMonth}>
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="weekday-label" style={{
                                        textAlign: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: '#a0aec0',
                                        textTransform: 'uppercase',
                                        padding: '8px 0'
                                    }}>
                                        {day}
                                    </div>
                                ))}

                                {calendarDays.map((dayObj, index) => (
                                    <div
                                        key={dayObj.key}
                                        className={`calendar-day-cell ${dayObj.type === 'empty' ? 'empty-cell' : ''}`}
                                        style={{
                                            minHeight: '80px',
                                            borderRadius: '12px',
                                            padding: '8px',
                                            transition: 'all 0.2s ease',
                                            border: dayObj.isSelected ? '2px solid #5392f9' : '1px solid #edf2f7',
                                            background: dayObj.isSelected ? 'rgba(83, 146, 249, 0.05)' : (dayObj.type === 'empty' ? 'transparent' : 'white'),
                                            cursor: dayObj.type === 'empty' ? 'default' : 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            ...(dayObj.type === 'empty' ? { border: 'none' } : {})
                                        }}
                                        onClick={() => handleDayClick(dayObj)}
                                    >
                                        {dayObj.type !== 'empty' && (
                                            <>
                                                <span style={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: 700,
                                                    color: dayObj.status === 'booked' ? '#cbd5e0' : '#2d3748'
                                                }}>
                                                    {dayObj.day}
                                                </span>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={dayObj.slots}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const dateStr = dayObj.date.toISOString().split('T')[0];
                                                            setMonthlyAvailability(prev => ({ ...prev, [dateStr]: val }));
                                                        }}
                                                        onBlur={(e) => handleSaveSlots(dayObj.date.toISOString().split('T')[0], e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveSlots(dayObj.date.toISOString().split('T')[0], e.target.value);
                                                        }}
                                                        style={{
                                                            fontSize: '0.85rem',
                                                            fontWeight: 700,
                                                            color: dayObj.slots === 0 ? '#e53e3e' : (dayObj.slots < 5 ? '#dd6b20' : '#38a169'),
                                                            background: dayObj.slots === 0 ? '#fff5f5' : (dayObj.slots < 5 ? '#fffaf0' : '#f0fff4'),
                                                            padding: '4px',
                                                            borderRadius: '6px',
                                                            textAlign: 'center',
                                                            width: '100%',
                                                            border: '1px solid transparent',
                                                            transition: 'all 0.2s ease',
                                                            cursor: 'text'
                                                        }}
                                                        className="slot-inline-input"
                                                    />
                                                    <span style={{ fontSize: '0.6rem', textAlign: 'center', color: '#a0aec0', fontWeight: 600 }}>PAX LEFT</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '24px', display: 'flex', gap: '24px', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#38a169' }}></div> Tersedia
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#dd6b20' }}></div> Hampir Penuh
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#e53e3e' }}></div> Penuh
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-col">
                        {/* Recent Bookings Card */}
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 600 }}>Tempahan Terkini</h3>
                            <div className="bookings-list">
                                {dashboardData && dashboardData.recentBookings && dashboardData.recentBookings.length > 0 ? (
                                    dashboardData.recentBookings.map((booking) => (
                                        <div key={booking.id} className="booking-item" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: 600, color: '#2d3748' }}>{booking.firstName || 'Guest'}</span>
                                                <span className="booking-status-pill" style={{
                                                    background: booking.status === 'confirmed' ? '#e6fffa' : booking.status === 'cancelled' ? '#fff5f5' : '#fffaf0',
                                                    color: booking.status === 'confirmed' ? '#047857' : booking.status === 'cancelled' ? '#c53030' : '#d69e2e',
                                                    fontSize: '0.7rem'
                                                }}>
                                                    {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1)) : 'Pending'}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                                                {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '-'}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#718096', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>Tiada tempahan terkini.</p>
                                )}
                            </div>
                            <button
                                className="btn-next"
                                style={{ width: '100%', marginTop: '12px', padding: '12px', fontSize: '0.9rem' }}
                                onClick={() => navigate('/partner/booking')}
                            >
                                Lihat Semua Tempahan
                            </button>
                        </div>

                        {/* Property Snapshot Card */}
                        <div className="glass-card" style={{ padding: '24px', marginTop: '24px', background: 'linear-gradient(to bottom right, #ffffff, #f7fafc)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>Property View</h3>
                            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '140px', marginBottom: '16px' }}>
                                <img
                                    src={selectedActivity?.image ? `https://localhost:5000${selectedActivity.image}` : activityData.image}
                                    alt="Activity"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedActivity?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#718096' }}>ID: {selectedActivity?.sku || activityData.id}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerActivityDashboard;
