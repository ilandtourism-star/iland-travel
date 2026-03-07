import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { secureFetch } from '../../lib/api';
import boatImage from '../../assets/images/Private Boat Trip/1.png';

// Sub-component for Calendar Widget (Monthly Grid)
const CalendarWidget = ({ onSelect, selectedDate, monsoonMonths = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayKey = getFirstDayOfMonth(year, month);
    // JS getDay(): Sun=0, Mon=1...Sat=6. We want Mon=0...Sun=6.
    const startOffset = (firstDayKey + 6) % 7;

    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const isMonsoon = (m) => monsoonMonths.includes(m);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="fake-calendar">
            <div className="cal-header">
                <span onClick={handlePrevMonth} className="cal-nav-btn">&lt;</span>
                <span className={isMonsoon(month) ? 'text-monsoon' : ''}>
                    {monthNames[month]} {year}
                    {isMonsoon(month) && <small style={{ display: 'block', fontSize: '0.6em', color: '#e53e3e' }}>(Monsoon Season)</small>}
                </span>
                <span onClick={handleNextMonth} className="cal-nav-btn">&gt;</span>
            </div>
            <div className="cal-grid">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                    <span key={d} className="cal-day-label">{d}</span>
                ))}
                {days.map((d, index) => {
                    if (!d) return <span key={`empty-${index}`}></span>;

                    const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                    const isPast = d < today;
                    const monsoon = isMonsoon(d.getMonth());
                    const isDisabled = isPast || monsoon;

                    return (
                        <span
                            key={index}
                            onClick={() => !isDisabled && onSelect(d)}
                            className={`cal-date-cell ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                            title={monsoon ? 'Closed due to Monsoon' : isPast ? 'Date passed' : ''}
                        >
                            {d.getDate()}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

const UniversalBookingCalendar = ({
    apiEndpoint,
    defaultPrice,
    defaultTitle,
    maxPax,
    nextStepRoute,
    minAdults = 1
}) => {
    const { error } = useToast();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [adultCount, setAdultCount] = useState(minAdults);
    const [childCount, setChildCount] = useState(0);
    const [remainingSlots, setRemainingSlots] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [monsoonMonths, setMonsoonMonths] = useState([10, 11, 0, 1]); // Default fallback

    const [packageData, setPackageData] = useState(null);

    useEffect(() => {
        // Fetch Monsoon Settings
        secureFetch('/api/v1/settings/monsoon_months')
            .then(res => res.json())
            .then(data => {
                if (data.success) setMonsoonMonths(data.value);
            })
            .catch(err => console.error("Error fetching monsoon settings:", err));

        if (apiEndpoint) {
            secureFetch(`/api/v1/vacation/${apiEndpoint}`)
                .then(res => res.json())
                .then(data => setPackageData(data))
                .catch(err => console.error("Error fetching package data:", err));
        }
    }, [apiEndpoint]);

    useEffect(() => {
        if (apiEndpoint && selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setLoadingSlots(true);
            secureFetch(`/api/v1/booking/availability/${apiEndpoint}/${formattedDate}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setRemainingSlots(data.remaining_pax);
                    }
                })
                .catch(err => console.error("Error fetching availability:", err))
                .finally(() => setLoadingSlots(false));
        } else {
            setRemainingSlots(null);
        }
    }, [apiEndpoint, selectedDate]);

    const price = (packageData && packageData.price) ? packageData.price : defaultPrice;
    const title = (packageData && packageData.name) ? packageData.name : defaultTitle;

    let calculatedTotal;
    if (packageData && packageData.childPrice) {
        // Per Person Calculation
        calculatedTotal = (adultCount * parseFloat(price)) + (childCount * parseFloat(packageData.childPrice));
    } else {
        // Per Boat Calculation
        calculatedTotal = parseFloat(price);
    }

    const totalPrice = calculatedTotal.toFixed(2);
    const originalPrice = (calculatedTotal * 1.1).toFixed(2);

    const handleNextStep = () => {
        if (!selectedDate) {
            error("Please select a date");
            return;
        }

        const totalGuests = adultCount + childCount;
        const limit = remainingSlots !== null ? remainingSlots : maxPax;
        if (limit && totalGuests > limit) {
            error(`Maaf, hanya tinggal ${limit} slot kosong.`);
            return;
        }

        // Navigate to Contact Details page with state
        navigate(nextStepRoute, {
            state: {
                packageName: title,
                vacation_sku: apiEndpoint, // Pass SKU for backend availability check
                date: selectedDate,
                adults: adultCount,
                children: childCount,
                totalPrice: totalPrice,
                originalPrice: originalPrice
            }
        });
    };

    return (
        <div className="kapas-booking-page">
            <style>{`
                .cal-date-cell.disabled {
                    background-color: #f1f1f1 !important;
                    color: #ccc !important;
                    cursor: not-allowed !important;
                    opacity: 0.6;
                }
                .text-monsoon {
                    color: #e53e3e !important;
                    font-weight: bold;
                }
            `}</style>
            <div className="container" style={{ display: 'block', maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Select Your Date</h2>

                {/* Monsoon Notice Banner */}
                <div style={{
                    backgroundColor: '#fff5f5',
                    borderLeft: '4px solid #e53e3e',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: '#e53e3e', fontSize: '20px' }}></i>
                    <div>
                        <strong style={{ color: '#c53030', display: 'block', marginBottom: '4px' }}>Sekatan Musim Monsun (Closed)</strong>
                        <p style={{ margin: 0, fontSize: '14px', color: '#742a2a' }}>
                            Aktiviti pulau ditutup dari **November hingga Februari** setiap tahun demi keselamatan.
                            Tarikh pada bulan-bulan tersebut telah disekat dalam kalendar.
                        </p>
                    </div>
                </div>

                <div className={`package-card-container is-open`}>
                    <div className="card-row top-row">
                        <span className="pkg-title">{title}</span>
                        <a href="#" className="details-link">See details &gt;</a>
                    </div>

                    <div className="booking-view">
                        <hr className="booking-divider" />

                        <div className="booking-grid">

                            <div className="calendar-section">
                                <label className="section-label">Select date</label>
                                <CalendarWidget
                                    selectedDate={selectedDate}
                                    onSelect={setSelectedDate}
                                    monsoonMonths={monsoonMonths}
                                />
                            </div>

                            <div className="traveler-section">
                                <label className="section-label">Travelers</label>
                                {remainingSlots !== null ? (
                                    <p style={{
                                        fontSize: '13px',
                                        color: remainingSlots < 5 ? '#e53e3e' : '#059669',
                                        fontWeight: 600,
                                        marginBottom: '8px'
                                    }}>
                                        {loadingSlots ? 'Menyemak...' : `${remainingSlots} slot kosong lagi`}
                                    </p>
                                ) : (
                                    maxPax && <p className="min-pax-label">Kapasiti Bot: {maxPax} pax</p>
                                )}

                                <div className="counter-row">
                                    <span>Adult {packageData?.childPrice ? `- RM${packageData.price}` : '(ages 13-99)'}</span>
                                    <div className="counter-control">
                                        <button
                                            className="round-btn"
                                            onClick={() => setAdultCount(Math.max(minAdults, adultCount - 1))}
                                        >-</button>
                                        <span>{adultCount}</span>
                                        <button
                                            className="round-btn"
                                            onClick={() => {
                                                const currentTotal = adultCount + childCount;
                                                const limit = remainingSlots !== null ? remainingSlots : maxPax;
                                                if (!limit || currentTotal < limit) {
                                                    setAdultCount(adultCount + 1);
                                                }
                                            }}
                                        >+</button>
                                    </div>
                                </div>

                                <div className="counter-row">
                                    <span>Child {packageData?.childPrice ? `- RM${packageData.childPrice}` : '(ages 3-12)'}</span>
                                    <div className="counter-control">
                                        <button
                                            className="round-btn"
                                            onClick={() => setChildCount(Math.max(0, childCount - 1))}
                                        >-</button>
                                        <span>{childCount}</span>
                                        <button
                                            className="round-btn"
                                            onClick={() => {
                                                const currentTotal = adultCount + childCount;
                                                const limit = remainingSlots !== null ? remainingSlots : maxPax;
                                                if (!limit || currentTotal < limit) {
                                                    setChildCount(childCount + 1);
                                                }
                                            }}
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="booking-footer">
                            <div className="total-price">
                                <span className="final-price" style={{ color: '#ef4444', fontWeight: 'bold' }}>RM {
                                    (packageData?.childPrice
                                        ? ((adultCount * parseFloat(packageData.price)) + (childCount * parseFloat(packageData.childPrice)))
                                        : parseFloat(price)
                                    ).toFixed(2)
                                }</span>
                            </div>
                            <button className="next-step-btn" onClick={handleNextStep}>
                                Next step
                            </button>
                        </div>

                    </div>
                </div>
            </div >
        </div >
    );
};

export default UniversalBookingCalendar;
