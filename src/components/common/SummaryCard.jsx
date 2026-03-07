import React from 'react';

const SummaryCard = ({ title, location, date, ticketType, guests, originalPrice, totalPrice }) => {
  return (
    <div className="card sticky-summary">
      <div className="summary-header">
        <img src="/assets/images/1.png" alt={title} className="summary-img" />
        <div>
          <div className="summary-title">{title}</div>
          <div className="summary-subtitle">{location}</div>
        </div>
      </div>

      <div className="detail-row">
        <span className="detail-label">Date</span>
        <span className="detail-value">{date}</span>
      </div>
      
      <div className="detail-row">
        <span className="detail-label">Ticket Type</span>
        <span className="detail-value">{ticketType}</span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Guests</span>
        <span className="detail-value">{guests}</span>
      </div>

      <ul className="features-list">
        <li>Instant confirmation</li>
        <li>This booking is non-refundable</li>
      </ul>

      <div className="price-section">
        <div className="detail-row">
          <span className="detail-label">Original Price</span>
          <span className="price-original" style={{ textDecoration: 'line-through', color: '#94a3b8' }}>RM {originalPrice !== '0.00' ? originalPrice : (parseFloat(totalPrice || 0) * 1.3).toFixed(2)}</span>
        </div>
        <div className="detail-row" style={{ marginBottom: 0, alignItems: 'flex-end' }}>
          <span className="detail-label" style={{ fontSize: '16px', alignSelf: 'center' }}>Total Due</span>
          <div>
            <span className="price-total">RM {totalPrice}</span>
          </div>
        </div>
        <span className="price-note" style={{ marginTop: '5px' }}>Included taxes & fees</span>
      </div>
    </div>
  );
};

export default SummaryCard;
