import React, { useState, useEffect } from 'react';

/**
 * Komponen DateScroller
 * Digunakan untuk memilih tarikh aktiviti secara cepat (cth: Pakej Pulau Kapas)
 */
const DateScroller = ({ onDateSelect, daysToDisplay = 7 }) => {
  const [dates, setDates] = useState([]);
  const [activeDate, setActiveDate] = useState('');

  useEffect(() => {
    const days = ['Ahad', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
    const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
    const today = new Date();
    const tempDates = [];

    for (let i = 0; i < daysToDisplay; i++) {
      let date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Menggunakan format tempatan untuk kunci tarikh
      const fullDate = date.toISOString().split('T')[0];
      
      tempDates.push({
        fullDate,
        dayName: days[date.getDay()],
        dateNum: date.getDate(),
        monthName: months[date.getMonth()],
        label: i === 0 ? 'Hari Ini' : i === 1 ? 'Esok' : ''
      });
    }

    setDates(tempDates);
    
    // Auto-pilih tarikh hari esok sebagai default (seperti dalam kod asal anda)
    const defaultDate = tempDates[1].fullDate;
    setActiveDate(defaultDate);
    onDateSelect(defaultDate);
  }, [daysToDisplay, onDateSelect]);

  const handleDateClick = (fullDate) => {
    setActiveDate(fullDate);
    onDateSelect(fullDate);
  };

  return (
    <div className="date-scroller-container">
      <div className="date-scroller">
        {dates.map((d) => (
          <div 
            key={d.fullDate} 
            className={`date-card ${activeDate === d.fullDate ? 'active' : ''}`}
            onClick={() => handleDateClick(d.fullDate)}
          >
            <span className="month-name">{d.monthName}</span>
            <span className="date-number">{d.dateNum}</span>
            <span className="day-name">{d.dayName}</span>
            {d.label && <span className="date-badge">{d.label}</span>}
          </div>
        ))}
        
        {/* Butang Tarikh Tambahan */}
        <div className="date-card more-dates-btn">
          <div className="calendar-icon">📅</div>
          <span className="more-text">Lain-lain</span>
        </div>
      </div>
    </div>
  );
};

export default DateScroller;
