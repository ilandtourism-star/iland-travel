import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Calendar Widget Component
const CalendarWidget = ({ onSelect, selectedDate }) => {
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
          return (
            <span
              key={index}
              onClick={() => onSelect(d)}
              className={`cal-date-cell ${isSelected ? 'selected' : ''}`}
            >
              {d.getDate()}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const PackageBookingCard = ({ title, price, childPrice, maxPax, checkoutLink, image, rating, reviews, features, badge, pricingType = 'pax' }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const activeModal = searchParams.get('modal');
    const isThisModalOpen = activeModal === `card-booking-${title}`;

    if (isBookingOpen !== isThisModalOpen) {
      setIsBookingOpen(isThisModalOpen);
    }
  }, [searchParams, title, isBookingOpen]);

  const totalPrice = pricingType === 'unit'
    ? parseFloat(price).toFixed(2)
    : ((parseFloat(price) * adultCount) + (parseFloat(childPrice || price) * childCount)).toFixed(2);

  const displayOriginalPrice = (parseFloat(price || 0) * 1.3).toFixed(0);

  const handleNextStep = () => {
    navigate(checkoutLink || '/checkout', {
      state: {
        title,
        price,
        selectedDate,
        adultCount,
        childCount,
        totalPrice,
        originalPrice: displayOriginalPrice
      }
    });
  };

  const salePriceNum = parseFloat(price || 0);
  const origPriceNum = parseFloat(displayOriginalPrice || 0);
  const discountPercent = origPriceNum > 0 && origPriceNum > salePriceNum
    ? Math.round(((origPriceNum - salePriceNum) / origPriceNum) * 100)
    : 0;

  return (
    <div className={`package-booking-card ${isExpanded ? 'expanded' : ''}`} style={{ marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', background: '#fff', maxHeight: 'none', overflow: 'visible', maxWidth: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Merged ActivityCard visuals when closed */}
      {!isBookingOpen ? (
        <div className="activity-card-content" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {badge && <div className="badge-top" style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff0058', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{badge}</div>}

          {image && (
            <div className="card-image-wrapper" style={{ height: '200px', margin: '-20px -20px 15px -20px', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
              <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <h3 className="card-title" style={{ fontSize: '1.2em', fontWeight: '700', margin: '0 0 5px 0', color: '#2a2a2e' }}>{title}</h3>
          {/* Rating logic matching ActivityCard */}
          <div className="star-rating" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {(() => {
              const stars = [];
              const numRating = parseFloat(rating || 0);
              const fullStars = Math.floor(numRating);
              const hasHalfStar = numRating % 1 >= 0.5;

              for (let i = 0; i < fullStars; i++) {
                stars.push(<i key={`full-${i}`} className="fas fa-star" style={{ color: '#ffc700', fontSize: '0.8em', marginRight: '2px' }}></i>);
              }
              if (hasHalfStar) {
                stars.push(<i key="half" className="fas fa-star-half-alt" style={{ color: '#ffc700', fontSize: '0.8em', marginRight: '2px' }}></i>);
              }
              const emptyStars = 5 - stars.length;
              for (let i = 0; i < emptyStars; i++) {
                stars.push(<i key={`empty-${i}`} className="far fa-star" style={{ color: '#ccc', fontSize: '0.8em', marginRight: '2px' }}></i>);
              }
              return stars;
            })()}
            <span className="review-count" style={{ marginLeft: '5px', fontSize: '0.85em', color: '#666' }}>{rating} ({reviews} reviews)</span>
          </div>

          {/* Features List */}
          {features && features.length > 0 && (
            <ul className="features-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
              {features.map((feature, index) => (
                <li key={index} style={{ marginBottom: '5px', fontSize: '0.9em', color: '#555', display: 'flex', alignItems: 'center' }}>
                  <i className={feature.icon || 'fas fa-check-circle'} style={{ marginRight: '8px', color: 'DarkTurquoise' }}></i> {feature.text}
                </li>
              ))}
            </ul>
          )}

          <div className="card-row bottom-row" style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="price-info">
              <span className="pkg-desc" style={{ fontSize: '0.8em', color: '#888', display: 'block' }}>Starting from</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                {salePriceNum < 100 && discountPercent > 0 ? (
                  <span className="discount-badge" style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    -{discountPercent}%
                  </span>
                ) : (
                  <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9em' }}>
                    RM {displayOriginalPrice}
                  </span>
                )}
              </div>
              <div className="pkg-price-group" style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span className="currency" style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#d93025' }}>RM</span>
                <span className="amount" style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#d93025' }}>{price}</span>
              </div>
            </div>
            <div className="action-btn">
              <button
                className="choose-btn"
                onClick={() => {
                  setIsBookingOpen(true);
                  setSearchParams({ modal: `card-booking-${title}` }, { replace: false });
                }}
                style={{ background: 'DarkTurquoise', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
              >
                Ticket
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="booking-view" style={{ padding: '20px' }}>
          <div className="card-row top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span className="pkg-title" style={{ fontSize: '1.2em', fontWeight: '700' }}>{title}</span>
            <button onClick={() => {
              setIsBookingOpen(false);
              if (searchParams.get('modal') === `card-booking-${title}`) {
                navigate(-1);
              }
            }} style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#999' }}>×</button>
          </div>
          <hr className="booking-divider" style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

          <div className="booking-grid">

            <div className="calendar-section" style={{ marginBottom: '20px' }}>
              <label className="section-label" style={{ display: 'block', fontWeight: '600', marginBottom: '10px' }}>Select date</label>
              <CalendarWidget
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
              />
            </div>

            <div className="traveler-section">
              <label className="section-label" style={{ display: 'block', fontWeight: '600', marginBottom: '10px' }}>Travelers</label>
              <p className="min-pax-label" style={{ fontSize: '0.85em', color: '#666', marginBottom: '15px' }}>Min 1 adult</p>

              <div className="counter-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span>Adult (ages 13-99)</span>
                <div className="counter-control" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="round-btn"
                    onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                  >-</button>
                  <span style={{ minWidth: '20px', textAlign: 'center' }}>{adultCount}</span>
                  <button
                    className="round-btn"
                    onClick={() => setAdultCount(adultCount + 1)}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>

              <div className="counter-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Child (ages 3-12)</span>
                <div className="counter-control" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="round-btn"
                    onClick={() => setChildCount(Math.max(0, childCount - 1))}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                  >-</button>
                  <span style={{ minWidth: '20px', textAlign: 'center' }}>{childCount}</span>
                  <button
                    className="round-btn"
                    onClick={() => setChildCount(childCount + 1)}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-footer" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <div className="total-price" style={{ marginBottom: '15px', textAlign: 'right' }}>
              <span className="final-price" style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d93025' }}>RM {totalPrice}</span>
            </div>
            <button className="next-step-btn" onClick={handleNextStep} style={{ width: '100%', padding: '15px', background: 'DarkTurquoise', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1em', fontWeight: 'bold', cursor: 'pointer' }}>
              Next step
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default PackageBookingCard;
