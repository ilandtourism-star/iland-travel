import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CalendarWidget from './CalendarWidget';

const BookingCard = ({ title, price, childPrice, maxPax, checkoutLink, features, image, rating, reviews, badge }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle phone "back" button using URL Search Params trap
  useEffect(() => {
    const activeModal = searchParams.get('modal');
    if (isBookingOpen && activeModal !== 'card-booking') {
      setIsBookingOpen(false);
    }
  }, [searchParams, isBookingOpen]);

  // Calculate total price dynamically
  const currentPrice = parseFloat(price || 0);
  const currentChildPrice = parseFloat(childPrice || price || 0);
  const totalPrice = ((currentPrice * adultCount) + (currentChildPrice * childCount)).toFixed(2);
  const displayOriginalPrice = (currentPrice * 1.3).toFixed(0);

  const handleNextStep = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    navigate(checkoutLink || '/checkout', {
      state: {
        title,
        price: currentPrice,
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
    <div className={`package-booking-card ${isBookingOpen ? 'expanded' : ''}`} style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div className="card-row top-row" style={{ padding: '15px', background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="pkg-title" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{title}</span>
        <button
          className="details-link"
          onClick={() => {
            const newState = !isBookingOpen;
            setIsBookingOpen(newState);
            if (newState) {
              setSearchParams({ modal: 'card-booking' }, { replace: false });
            } else if (searchParams.get('modal') === 'card-booking') {
              navigate(-1);
            }
          }}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isBookingOpen ? 'Close' : 'See details >'}
        </button>
      </div>

      {!isBookingOpen ? (
        <div className="initial-view" style={{ padding: '15px' }}>
          <div className="card-row bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="price-info">
              <span className="pkg-desc" style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>Starting from</span>
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
              <div className="pkg-price-group" style={{ display: 'flex', alignItems: 'baseline', color: '#d93025' }}>
                <span className="currency" style={{ fontSize: '0.9rem', marginRight: '4px' }}>RM</span>
                <span className="amount" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{price}</span>
              </div>
            </div>
            <div className="action-btn">
              <button
                className="choose-btn"
                onClick={() => {
                  setIsBookingOpen(true);
                  setSearchParams({ modal: 'card-booking' }, { replace: false });
                }}
                style={{
                  backgroundColor: 'DarkTurquoise',
                  color: 'white',
                  border: 'none',
                  padding: '10px 25px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Ticket
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="booking-view" style={{ padding: '15px' }}>
          <hr className="booking-divider" style={{ margin: '0 0 15px 0', border: '0', borderTop: '1px solid #eee' }} />

          <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            <div className="calendar-section">
              <label className="section-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Select date</label>
              <CalendarWidget
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
              />
            </div>

            <div className="traveler-section">
              <label className="section-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Travelers</label>
              <p className="min-pax-label" style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>Min 1 adult</p>

              <div className="counter-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span>Adult (ages 13-99)</span>
                <div className="counter-control" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="round-btn"
                    onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                  >-</button>
                  <span>{adultCount}</span>
                  <button
                    className="round-btn"
                    onClick={() => setAdultCount(adultCount + 1)}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>

              <div className="counter-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Child (ages 3-12)</span>
                <div className="counter-control" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="round-btn"
                    onClick={() => setChildCount(Math.max(0, childCount - 1))}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                  >-</button>
                  <span>{childCount}</span>
                  <button
                    className="round-btn"
                    onClick={() => setChildCount(childCount + 1)}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="total-price">
              <span className="final-price" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d93025' }}>RM {totalPrice}</span>
            </div>
            <button
              className="next-step-btn"
              onClick={handleNextStep}
              style={{
                backgroundColor: '#ff5722',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Next step
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default BookingCard;
