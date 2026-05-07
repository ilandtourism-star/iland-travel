import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import PackageBookingCard from './PackageBookingCard';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import CalendarWidget from './CalendarWidget';
import SeasonNotifyForm from './SeasonNotifyForm';

const ActivityCard = ({
  title = "Tajuk Aktiviti",
  rating = 0,
  reviews = 0,
  description = "", // Add description prop
  features = [],
  packages = [],
  price = 0,
  image = "https://via.placeholder.com/300",
  images = [], // New prop for gallery images
  link = "/checkout",
  hideBadge = false,
  badge = null,
  buttonText = "Buy Now",
  hideButton = false,
  hidePrice = false,
  isBooking = false, // Default to false so View Details works
  checkoutLink,
  isInSeason = true,
  sku,
  isFlashSale = false,
  flashSaleEndTime = null,
  originalPrice = null,
  totalSeats = 10,
  seatsLeft = 10,
  priceColor = null,
  isTaxiBoat = false,
  locationOptions = [],
  defaultFrom = "",
  defaultTo = "",
  timeOptions = [],
  defaultTime = "",
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to slugify IDs for URL stability
  const slugify = (text) => text?.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-') || '';
  const entityId = slugify(sku || title);

  const isGalleryOpen = searchParams.get('modal') === 'gallery' && searchParams.get('id') === entityId;
  const isBookingOpen = searchParams.get('modal') === 'booking' && searchParams.get('id') === entityId;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);

  // Taxi Boat State
  const [fromLocation, setFromLocation] = useState(defaultFrom || (locationOptions[0] || ""));
  const [toLocation, setToLocation] = useState(defaultTo || (locationOptions[1] || locationOptions[0] || ""));
  const [selectedTime, setSelectedTime] = useState(defaultTime || (timeOptions[0] || ""));

  // Flash Sale Countdown Logic
  const [timeLeft, setTimeLeft] = useState("");

  React.useEffect(() => {
    if (!isFlashSale || !flashSaleEndTime) return;

    const calculateTimeLeft = () => {
      const difference = new Date(flashSaleEndTime) - new Date();
      if (difference <= 0) return "00h 00m 00s";

      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isFlashSale, flashSaleEndTime]);



  // Use the provided images array, or fallback to the single main image if 'images' is empty
  const galleryImages = images.length > 0 ? images : [image];

  const openGallery = (e) => {
    // Only open gallery if there are valid images
    if (galleryImages.length > 0) {
      e.stopPropagation(); // Prevent navigating to details page if clicking image also triggers link
      setCurrentImageIndex(0);
      // Native Trap: Push a fake state to history
      setSearchParams({ modal: 'gallery', id: entityId });
      window.history.pushState({ modal: 'gallery', id: entityId }, "");
    }
  };

  const closeGallery = () => {
    if (isGalleryOpen) {
      if (window.history.state?.modal === 'gallery') {
        window.history.back();
      } else {
        setSearchParams({});
      }
    }
  };



  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Calculate total price dynamically
  const currentPrice = parseFloat(price || 0);
  // Simple default for child price if not provided: price - 10 (Matches typical pattern)
  // In a real app, childPrice should be a prop.
  const currentChildPrice = Math.max(0, currentPrice - 10);
  const totalPrice = ((currentPrice * adultCount) + (currentChildPrice * childCount)).toFixed(2);

  // Calculate reference price
  const displayOriginalPrice = originalPrice || (parseFloat(price || 0) * 1.3).toFixed(0);

  const salePriceNum = parseFloat(price || 0);
  const origPriceNum = parseFloat(displayOriginalPrice || 0);
  const discountPercent = origPriceNum > 0 && origPriceNum > salePriceNum
    ? Math.round(((origPriceNum - salePriceNum) / origPriceNum) * 100)
    : 0;

  const handleButtonClick = () => {
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'click_button', {
        'event_category': 'Engagement',
        'event_label': buttonText,
        'activity_title': title,
        'activity_sku': sku || 'no-sku'
      });
    }

    if (isBooking) {
      // Toggle the embedded booking calendar
      if (!isBookingOpen) {
        // Native Trap: Push fake state
        setSearchParams({ modal: 'booking', id: entityId });
        window.history.pushState({ modal: 'booking', id: entityId }, "");
      } else {
        if (window.history.state?.modal === 'booking') {
          window.history.back();
        } else {
          setSearchParams({});
        }
      }
    } else {
      // Navigate to details page
      navigate(link);
    }
  };

  // Global listener to catch the "Back" button event for modals
  useEffect(() => {
    const handlePopState = (event) => {
      if (isGalleryOpen || isBookingOpen) {
        // We caught the back button! Close the modal and stay on page.
        setSearchParams({});
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isGalleryOpen, isBookingOpen, setSearchParams]);

  // Handle Hash Scrolling
  useEffect(() => {
    if (window.location.hash === `#${entityId}`) {
      const el = document.getElementById(entityId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Optional: Add a brief highlight effect
          el.style.transition = 'box-shadow 0.5s ease';
          el.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.6)';
          setTimeout(() => el.style.boxShadow = 'none', 2000);
        }, 300); // slight delay to ensure rendering is complete
      }
    }
  }, [entityId, location.hash]);

  const handleNextStep = () => {
    if (isBooking && !selectedDate) {
      alert("Please select a date");
      return;
    }

    // Navigate to checkout with state
    navigate(checkoutLink || link || '/checkout', {
      state: {
        title,
        price: currentPrice,
        selectedDate,
        adultCount,
        childCount,
        totalPrice,
        originalPrice: displayOriginalPrice,
        fromLocation: isTaxiBoat ? fromLocation : null,
        toLocation: isTaxiBoat ? toLocation : null,
        selectedTime: isTaxiBoat ? selectedTime : null
      }
    });
  };

  // --- URL SEARCH PARAMS STRATEGY ---
  // Pure URL routing, handled by the UI checks above. No sync effect needed.

  return (
    <>
      <div id={entityId} className={`activity-card ${isBookingOpen ? 'booking-active' : ''}`} style={{ transition: 'all 0.3s ease', position: 'relative' }}>
        {badge && <div className="badge-top">{badge}</div>}



        {/* Flash Sale Label */}
        {isFlashSale && (
          <div className="flash-sale-badge" style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: '900',
            letterSpacing: '1px',
            zIndex: 5,
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            animation: 'flashPulse 1.5s infinite'
          }}>
            FLASH SALE
          </div>
        )}

        {/* 1. Bahagian Gambar - Clickable for Gallery */}
        <div className="card-image-wrapper" onClick={openGallery} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', backgroundColor: '#f8f9fa', position: 'relative' }}>
          <img src={image} alt={title} loading="lazy" className="card-image" style={{ objectFit: 'cover', objectPosition: 'center 75%', width: '100%', height: '100%', minHeight: '200px' }} />
          {/* Optional: Add an icon or overlay to indicate it's a gallery */}
          {galleryImages.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem'
            }}>
              <i className="fas fa-images"></i> {galleryImages.length} Photos
            </div>
          )}
        </div>

        <div className="card-content">
          {/* 2. Tajuk & Rating */}
          <h3 className="card-title">{title}</h3>

          <div className="star-rating">
            {/* Helper to render stars */}
            {(() => {
              const stars = [];
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating % 1 >= 0.5;

              // Full Stars
              for (let i = 0; i < fullStars; i++) {
                stars.push(<i key={`full-${i}`} className="fas fa-star text-gold"></i>);
              }

              // Half Star
              if (hasHalfStar) {
                stars.push(<i key="half" className="fas fa-star-half-alt text-gold"></i>);
              }

              // Empty Stars (Optional: fill up to 5)
              const emptyStars = 5 - stars.length;
              for (let i = 0; i < emptyStars; i++) {
                stars.push(<i key={`empty-${i}`} className="far fa-star text-muted"></i>);
              }

              return stars;
            })()}
            <span className="review-count">{rating} ({reviews} reviews)</span>
          </div>

          {/* Flash Sale Timer & Scarcity */}
          {isFlashSale && (
            <div className="flash-sale-info" style={{ margin: '15px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>
                <i className="fas fa-stopwatch"></i>
                <span>Offer ends in: <span style={{ fontFamily: 'monospace' }}>{timeLeft}</span></span>
              </div>

              <div className="scarcity-container" style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                  <span style={{ color: '#64748b' }}>Availability</span>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Only {seatsLeft} seats left!</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(seatsLeft / totalSeats) * 100}%`,
                    height: '100%',
                    backgroundColor: '#ef4444',
                    borderRadius: '10px',
                    transition: 'width 0.5s ease-out'
                  }}></div>
                </div>
              </div>
            </div>
          )}

          {/* 2.5 Description (Spots/Info) */}
          {description && (
            <p className="card-description" style={{
              fontSize: '0.9rem',
              color: '#64748b',
              margin: '12px 0 16px 0',
              lineHeight: '1.5'
            }}>
              {description}
            </p>
          )}

          {/* Social Proof / Public Observability */}
          <div className="social-proof-avatars" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', margin: '10px 0 15px 0' }}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${Math.floor(title.length + i * 5) % 70}`}
                  alt="User avatar"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    marginLeft: i === 1 ? '0' : '-12px',
                    backgroundColor: '#e2e8f0',
                    zIndex: 4 - i, /* Ensure correct overlap */
                    position: 'relative'
                  }}
                />
              ))}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid white',
                marginLeft: '-12px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                color: '#64748b',
                zIndex: 1,
                position: 'relative'
              }}>
                99+
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
              Joined by <span style={{ color: '#0ea5e9', fontWeight: 'bold' }}>1,200+ explorers</span>
            </span>
          </div>

          {/* 3. Ciri-ciri Aktiviti */}
          {features.length > 0 && (
            <ul className="features-list" style={{ listStyleType: 'none', padding: 0, margin: '0 0 15px 0' }}>
              {features.map((feature, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: '10px',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  color: '#334155',
                  lineHeight: '1.4'
                }}>
                  {((typeof feature === 'string' ? true : feature.icon !== null)) && (
                    <i
                      className={(typeof feature === 'string') ? 'fas fa-check-circle' : (feature.icon || 'fas fa-check-circle')}
                      style={{ marginTop: '3px', color: '#0ea5e9', minWidth: '16px', textAlign: 'center', fontSize: '1.1rem' }}
                    ></i>
                  )}
                  <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{typeof feature === 'string' ? feature : feature.text}</span>
                </li>
              ))}
            </ul>
          )}

          {/* 4. Pilihan Pakej (Jika ada) */}
          {packages.length > 0 && (
            <div className="package-options">
              <h4>Package Options:</h4>
              <ul className="features-list">
                {packages.map((pkg, idx) => (
                  <li key={idx} style={{ marginBottom: '15px', borderBottom: idx !== packages.length - 1 ? '1px dashed #e2e8f0' : 'none', paddingBottom: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="pax" style={{ fontWeight: 'bold', color: '#1e293b' }}>
                          <i className={pkg.icon || "fas fa-user-friends"} style={{ marginRight: '8px', color: '#0ea5e9' }}></i> 
                          {pkg.label}
                        </span>
                        <strong style={{ fontSize: '1.5em', color: '#ef4444' }}>RM {pkg.price}</strong>
                      </div>
                      {pkg.link && (
                        <button className="btn-details"
                          onClick={() => navigate(pkg.link)}
                          style={{
                            width: '100%',
                            transition: 'all 0.3s',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4.5 Taxi Boat Selection Bar */}
          {isTaxiBoat && (locationOptions.length > 0 || timeOptions.length > 0) && (
            <div className="taxi-selection-bar" style={{
              margin: '15px 0',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', alignItems: 'end', gap: '10px' }}>
                {locationOptions.length > 0 && (
                  <>
                    <div className="select-wrapper">
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: '700', marginBottom: '4px' }}>FROM</label>
                      <select
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      >
                        {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>

                    <div className="select-wrapper">
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: '700', marginBottom: '4px' }}>TO</label>
                      <select
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      >
                        {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {timeOptions.length > 0 && (
                  <div className="select-wrapper" style={{ gridColumn: locationOptions.length > 0 ? 'span 1' : 'span 3' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: '700', marginBottom: '4px' }}>TIME</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a' }}
                    >
                      {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Harga & Butang atau Borang Notifikasi */}
          {!isInSeason ? (
            <SeasonNotifyForm sku={sku} title={title} />
          ) : (
            <div className="price-section">
              {!hidePrice && (
                <div className="price-info">
                  <span className="price-label">Starting from</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {salePriceNum < 100 && discountPercent > 0 ? (
                      <span className="discount-badge" style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        -{discountPercent}%
                      </span>
                    ) : (
                      <span className="original-price" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem' }}>
                        RM {displayOriginalPrice}
                      </span>
                    )}
                    <span className="price-amount" style={{ color: priceColor || '#ef4444', fontWeight: 'bold' }}>RM {price}</span>
                  </div>
                </div>
              )}
              {!hideButton && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  <button className="btn-details" onClick={handleButtonClick} style={{
                    transition: 'all 0.3s',
                    fontWeight: isBooking ? 'normal' : 'bold',
                    textTransform: isBooking ? 'none' : 'uppercase',
                    letterSpacing: isBooking ? '0' : '1px',
                    width: '100%'
                  }}
                    onMouseOver={(e) => {
                      if (!isBooking) {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = `0 8px 15px ${priceColor || '#ef4444'}66`;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isBooking) {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {isBooking && isBookingOpen ? 'Close' : buttonText}
                  </button>

                  {/* Practical Value Download Button */}
                  {!isBooking && (
                    <button onClick={() => {
                      try {
                        const doc = new jsPDF();

                        // Main Styling & Colors
                        doc.setFillColor(15, 23, 42); // Dark slate header
                        doc.rect(0, 0, 210, 40, 'F');

                        doc.setTextColor(255, 255, 255);
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(22);
                        doc.text("iland Ocean Navigator's", 105, 20, null, null, "center");
                        doc.setFontSize(14);
                        doc.text("Ultimate Survival & Packing Guide", 105, 30, null, null, "center");

                        // Section 1: The Essentials
                        doc.setTextColor(15, 23, 42);
                        doc.setFontSize(16);
                        doc.text("The Explorer's Essentials", 20, 55);

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(11);
                        const essentials = [
                          "[] Microfiber Towel (Dries fast, saves space)",
                          "[] Reef-Safe Sunscreen (Protect the secret inhabitants!)",
                          "[] Dry Bag (5L or 10L is perfect for boat trips)",
                          "[] Motion Sickness Pills (Take 30 mins before boarding)",
                          "[] Reusable Water Bottle (Stay hydrated, save the ocean)",
                          "[] Power Bank & Waterproof Phone Pouch"
                        ];
                        let yPos = 65;
                        essentials.forEach(item => {
                          doc.text(item, 25, yPos);
                          yPos += 8;
                        });

                        // Section 2: Pro Insider Tips (Practical Value)
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(16);
                        doc.text("Insider Survival Hacks", 20, yPos + 10);

                        doc.setFont("helvetica", "normal");
                        yPos += 20;
                        const tips = [
                          "• The 'Wet Shirt' Hack: Wear a rash guard. It prevents jellyfish stings",
                          "  and stops severe sunburns better than lotion.",
                          "• Seasick prevention: Don't look at your phone on the boat. Look at the",
                          "  horizon and sit near the back (it bounces less).",
                          "• Never step on corals: They take decades to grow. Float over them.",
                          "• Secret spot etiquette: Leave no trace. Take only photos."
                        ];
                        tips.forEach(item => {
                          doc.text(item, 25, yPos);
                          yPos += 8;
                        });

                        // Footer (Behavioral Residue)
                        doc.setDrawColor(14, 165, 233);
                        doc.setLineWidth(0.5);
                        doc.line(20, 275, 190, 275);

                        doc.setFont("helvetica", "italic");
                        doc.setFontSize(10);
                        doc.setTextColor(100, 116, 139);
                        doc.text("Ready for the real adventure? Book your secret escape at www.iland.com", 105, 285, null, null, "center");

                        doc.save("iland-Survival-Guide.pdf");
                      } catch (e) {
                        alert("Failed to generate PDF. Make sure you are connected to the internet!");
                        console.error(e);
                      }
                    }} style={{
                      background: 'rgba(14, 165, 233, 0.1)',
                      color: '#0ea5e9',
                      border: '1px dashed #0ea5e9',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s'
                    }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(14, 165, 233, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'rgba(14, 165, 233, 0.1)';
                      }}
                    >
                      <i className="fas fa-file-pdf"></i> Get Packing List & Survival Guide
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 6. Embedded Booking Calendar */}
          {isBookingOpen && (
            <div className="booking-embedded-container" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>

                {/* Date Selection */}
                <div className="calendar-section">
                  <label className="section-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Select date</label>
                  <CalendarWidget
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </div>

                {/* Pax Selection */}
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
                  <span className="final-price" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d93025' }}>Total: RM {totalPrice}</span>
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
      </div>

      {/* Lightbox Gallery Modal */}
      {isGalleryOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }} onClick={closeGallery}>

          <button style={{
            position: 'absolute',
            top: '20px',
            right: '30px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '30px',
            cursor: 'pointer'
          }} onClick={closeGallery}>&times;</button>

          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '80%' }} onClick={e => e.stopPropagation()}>
            <img
              src={galleryImages[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '4px' }}
            />

            {galleryImages.length > 1 && (
              <>
                <button style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-50px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  padding: '10px',
                  cursor: 'pointer',
                  borderRadius: '50%'
                }} onClick={prevImage}>&#10094;</button>

                <button style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-50px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  padding: '10px',
                  cursor: 'pointer',
                  borderRadius: '50%'
                }} onClick={nextImage}>&#10095;</button>
              </>
            )}
          </div>

          <div style={{ marginTop: '20px', color: 'white', fontSize: '16px' }}>
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityCard;
