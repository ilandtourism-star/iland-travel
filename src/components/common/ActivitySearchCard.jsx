import React from 'react';

/**
 * Komponen ActivitySearchCard
 * Sesuai untuk hasil carian pakej di Pulau Kapas atau Redang.
 */
const ActivitySearchCard = ({
  title = "Tajuk Aktiviti",
  rating = 0,
  description = "Tiada penerangan disediakan.",
  features = [],
  price = 0,
  childPrice = null,
  image = "https://via.placeholder.com/300x200",
  isTopPick = false,
  paxInfo = "Per Adult"
}) => {

  // Fungsi untuk menjana bintang secara dinamik
  const renderStars = (num) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(num)) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === Math.ceil(num) && num % 1 !== 0) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };

  const handleCardClick = () => {
    actualNavigate(link || '/');
  };

  const salePriceNum = parseFloat(price || 0);
  const origPriceNum = parseFloat(displayOriginalPrice || 0) || (salePriceNum * 1.3);
  const discountPercent = origPriceNum > 0 && origPriceNum > salePriceNum
    ? Math.round(((origPriceNum - salePriceNum) / origPriceNum) * 100)
    : 0;

  return (
    <div className={`search-card ${isTopPick ? 'top-pick-active' : ''}`} onClick={handleCardClick}>
      {isTopPick && <div className="badge-top">PILIHAN TERBAIK</div>}

      <div className="card-img-container">
        <img src={image} alt={title} loading="lazy" />
      </div>

      <div className="card-content">
        <div className="card-info">
          <h3 className="card-title">{title}</h3>
          <div className="rating-container">
            <span className="stars-wrapper">{renderStars(rating)}</span>
            <span className="rating-number">{rating}</span>
          </div>
          <p className="card-desc">{description}</p>
        </div>

        <div className="features-grid">
          {features.length > 0 ? (
            features.map((feat, index) => (
              <span key={index} className="feature-tag">
                <i className={feat.icon || 'fas fa-check'}></i> {feat.text}
              </span>
            ))
          ) : (
            <span className="feature-tag-empty">Lihat butiran untuk kemudahan</span>
          )}
        </div>
      </div>

      <div className="card-action">
        <div className="price-box">
          <span className="price-label">{paxInfo}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            {salePriceNum < 100 && discountPercent > 0 ? (
              <span className="discount-badge" style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                -{discountPercent}%
              </span>
            ) : (
              <span className="price-original" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem', display: 'block' }}>
                RM {(origPriceNum).toFixed(0)}
              </span>
            )}
          </div>
          <span className="price-final">RM {price}</span>
          {childPrice && <span className="price-child">Kanak-kanak: RM {childPrice}</span>}
        </div>
        <button className="btn-select">Lihat Butiran</button>
      </div>
    </div>
  );
};

export default ActivitySearchCard;
