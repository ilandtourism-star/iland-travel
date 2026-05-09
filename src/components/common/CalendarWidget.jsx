import React, { useState } from 'react';

const CalendarWidget = ({ onSelect, selectedDate, allowedDaysOfWeek = null }) => {
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

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="fake-calendar">
            <div className="cal-header">
                <span onClick={handlePrevMonth} className="cal-nav-btn">&lt;</span>
                <span>{monthNames[month]} {year}</span>
                <span onClick={handleNextMonth} className="cal-nav-btn">&gt;</span>
            </div>
            <div className="cal-grid">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                    <span key={d} className="cal-day-label">{d}</span>
                ))}
                {days.map((d, index) => {
                    if (!d) return <span key={`empty-${index}`}></span>;
                    const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                    const isAllowed = allowedDaysOfWeek ? allowedDaysOfWeek.includes(d.getDay()) : true;
                    return (
                        <span
                            key={index}
                            onClick={() => isAllowed && onSelect(d)}
                            className={`cal-date-cell ${isSelected ? 'selected' : ''} ${!isAllowed ? 'disabled' : ''}`}
                            style={{ opacity: isAllowed ? 1 : 0.3, cursor: isAllowed ? 'pointer' : 'not-allowed' }}
                        >
                            {d.getDate()}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarWidget;
