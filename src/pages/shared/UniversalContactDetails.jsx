import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { secureFetch } from '../../lib/api';
import { countries } from '../../lib/countries';
import { useRef } from 'react';
import { getDisplayPackageName } from '../../utils/activityLinks';

const UniversalContactDetails = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const bookingState = location.state || {};
    const {
        vacation_sku,
        date: selectedDate,
        adults: adultCount = 1,
        children: childCount = 0,
        totalPrice = "0.00",
        packageName: initialTitle = "Package",
        originalPrice = "0.00"
    } = bookingState;

    const [packageData, setPackageData] = useState(null);
    const [formData, setFormData] = useState({
        firstname: '', lastname: '', email: '', country: '', code: '+60', mobile: ''
    });
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!location.state) {
            addToast('Sila pilih pakej dan tarikh terlebih dahulu.', 'error');
            navigate('/');
            return;
        }

        if (vacation_sku) {
            secureFetch(`/api/v1/vacation/${vacation_sku}`)
                .then(res => res.json())
                .then(data => setPackageData(data))
                .catch(err => console.error("Error fetching package data:", err));
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [location, navigate, addToast, vacation_sku]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountrySelect = (c) => {
        setFormData({ ...formData, country: c.name, code: c.dial_code });
        setShowCountryDropdown(false);
        setCountrySearch('');
    };

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = e.currentTarget.action;
        const pax = (Number(adultCount) || 0) + (Number(childCount) || 0);
        const title = getDisplayPackageName(vacation_sku, packageData?.name || initialTitle);
        const parsedDate = selectedDate ? new Date(selectedDate) : null;
        const isValidDate = parsedDate && !isNaN(parsedDate.getTime());

        const dateStr = isValidDate 
            ? parsedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) 
            : 'Not selected';

        const bookingPayload = {
            firstName: `${formData.firstname} ${formData.lastname}`,
            email: formData.email,
            packageName: title,
            vacation_sku: vacation_sku,
            date: isValidDate ? parsedDate.toISOString() : null,
            adults: Number(adultCount),
            children: Number(childCount),
            pax: pax,
            totalPrice: totalPrice
        };

        // Determine Jetty for WhatsApp message
        const islandName = (packageData?.island || '').toLowerCase();
        let jettyName = 'Neill Boat Services Jetty';
        let mapLink = 'https://maps.app.goo.gl/Y8QCaj8N1TJx2Y9w5?g_st=atm'; // Exact map link provided by user

        if (islandName === 'kapas') {
            jettyName = 'Jeti Marang';
            mapLink = `https://maps.app.goo.gl/ZBBPpGgvBBVtnwbC7`;
        } else if (islandName === 'perhentian') {
            jettyName = 'Kuala Besut Jetty';
            mapLink = `https://www.google.com/maps?q=${encodeURIComponent('Kuala Besut Jetty Terengganu')}`;
        }

        let timeText = '8.00am-4.00pm';
        const titleStr = title || '';
        const isSquidJigging = packageData?.category === 'squid_jigging' || titleStr.toLowerCase().includes('squid');
        if (islandName === 'kapas') {
            timeText = '8.30am';
        } else if (isSquidJigging) {
            timeText = '5.00pm-6.00am';
        }

        const whatsappMessage = 
`Hi ILand Travel, I would like to make a booking:

*PACKAGE DETAILS*
Package: ${title}
Date: ${dateStr}
Departure Time: ${timeText}
No. of Pax: ${adultCount} Adult${adultCount > 1 ? 's' : ''}${childCount > 0 ? `, ${childCount} Child${childCount > 1 ? 'ren' : ''}` : ''}

*CUSTOMER DETAILS*
Name: ${formData.firstname} ${formData.lastname}
Email: ${formData.email}
Phone No: ${formData.code}${formData.mobile}

*DEPARTURE LOCATION*
Jetty: ${jettyName}
Location Map: ${mapLink}

🔴 *TOTAL AMOUNT: RM ${totalPrice}* 🔴`;

        const safeWhatsappMessage = whatsappMessage.replace(/&/g, 'and');
        let whatsappUrl = `https://api.whatsapp.com/send?phone=60147081346&text=${encodeURIComponent(safeWhatsappMessage)}`;

        let isGroupChat = false;
        // Custom redirect for Redang and Perhentian Free Diving
        if (vacation_sku === 'free-dive-redang' || vacation_sku === 'free-dive-perhentian') {
            whatsappUrl = 'https://chat.whatsapp.com/IXE7Q3JSr4u8Za5ECrtuxa';
            isGroupChat = true;
        } else if (vacation_sku === 'skin-dive-perhentian') {
            whatsappUrl = 'https://chat.whatsapp.com/Fx1f8MlvJpt2aienR71d9i';
            isGroupChat = true;
        }

        try {
            // Attempt to save to backend silently
            await secureFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(bookingPayload)
            });
        } catch (err) {
            console.error("Backend save bypassed:", err);
        }

        if (isGroupChat) {
            try {
                await navigator.clipboard.writeText(whatsappMessage);
                addToast('Booking details copied! Please paste it into the WhatsApp Group.', 'success');
            } catch (err) {
                console.error("Failed to copy text: ", err);
                addToast('Please copy your details and send them to the WhatsApp Group.', 'success');
            }
            setTimeout(() => {
                window.location.href = whatsappUrl;
            }, 2000);
        } else {
            // Always redirect to WhatsApp to ensure user completes the booking
            addToast('Connecting to WhatsApp...', 'success');
            window.location.href = whatsappUrl;
        }
    };

    const title = getDisplayPackageName(vacation_sku, packageData?.name || initialTitle);
    const image = packageData?.imageUrl || 'https://via.placeholder.com/150';
    const description = packageData?.description || '';

    // Robust parsing for features (JSON string vs Object)
    let features = [];
    try {
        if (packageData?.features) {
            if (typeof packageData.features === 'string') {
                features = JSON.parse(packageData.features) || [];
            } else {
                features = packageData.features;
            }
        }
    } catch (e) {
        console.error("Error parsing features:", e);
    }
    if (!Array.isArray(features)) features = [];

    // Determine Jetty Name for UI rendering
    const displayIslandName = (packageData?.island || '').toLowerCase();
    let renderJettyName = 'Neill Boat Services Jetty';
    let mapQuery = 'Neill Boat Services Jetty';
    
    if (displayIslandName === 'kapas') {
        renderJettyName = 'Jeti Marang';
        mapQuery = 'Jeti Marang Terengganu';
    } else if (displayIslandName === 'perhentian') {
        renderJettyName = 'Kuala Besut Jetty';
        mapQuery = 'Kuala Besut Jetty Terengganu';
    }

    // Inject custom features for all packages
    let customFeatures = [...features];
    if (!customFeatures.some(f => f && typeof f.text === 'string' && (f.text.includes('Time :') || f.text.includes('Pick up jetty')))) {
        let timeText = 'Time : 8.00am-4.00pm';
        const titleStr = packageData?.name || initialTitle || '';
        const isSquidJigging = packageData?.category === 'squid_jigging' || titleStr.toLowerCase().includes('squid');
        if (displayIslandName === 'kapas') {
            timeText = 'Time : 8.30am';
        } else if (isSquidJigging) {
            timeText = 'Time : 5.00pm-6.00am';
        }
        customFeatures.push({ icon: 'fas fa-clock', text: timeText });
        customFeatures.push({ icon: 'fas fa-map-marker-alt', text: `Pick up jetty : ${renderJettyName}` });
    }

    return (
        <div className="premium-checkout-page">
            <div className="checkout-container">
                {/* LEFT COLUMN: Form */}
                <div className="checkout-main">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <i className="fas fa-arrow-left"></i> Back to selection
                    </button>

                    <div className="checkout-card">
                        <div className="card-header">
                            <h2>Contact Details</h2>
                            <p className="subtitle">Confirmation will be sent to the email provided below.</p>
                        </div>



                        <form action="/api/v1/booking" method="POST" onSubmit={handleSubmit} className="premium-form">
                            <div className="form-row">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="firstname"
                                        id="firstname"
                                        autoComplete="given-name"
                                        placeholder=" "
                                        onChange={handleChange}
                                        value={formData.firstname}
                                        required
                                    />
                                    <label htmlFor="firstname">First Name</label>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="lastname"
                                        id="lastname"
                                        autoComplete="family-name"
                                        placeholder=" "
                                        onChange={handleChange}
                                        value={formData.lastname}
                                        required
                                    />
                                    <label htmlFor="lastname">Last Name</label>
                                </div>
                            </div>

                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    placeholder=" "
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                />
                                <label htmlFor="email">Email Address</label>
                                <i className="fas fa-envelope input-icon"></i>
                            </div>

                            <div className="input-group" ref={dropdownRef}>
                                <input
                                    type="text"
                                    name="country"
                                    id="country_residence"
                                    autoComplete="off"
                                    placeholder=" "
                                    onFocus={() => setShowCountryDropdown(true)}
                                    onChange={(e) => {
                                        setCountrySearch(e.target.value);
                                        setFormData({ ...formData, country: e.target.value });
                                    }}
                                    value={showCountryDropdown ? countrySearch : formData.country}
                                    required
                                />
                                <label htmlFor="country_residence">Country/Region of residence</label>
                                <i className="fas fa-globe input-icon" style={{ cursor: 'pointer' }} onClick={() => setShowCountryDropdown(!showCountryDropdown)}></i>

                                {showCountryDropdown && (
                                    <div className="country-dropdown">
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map((c) => (
                                                <div
                                                    key={c.code}
                                                    className="country-item"
                                                    onClick={() => handleCountrySelect(c)}
                                                >
                                                    <span className="flag">{c.flag}</span>
                                                    <span className="name">{c.name}</span>
                                                    <span className="dial-code">{c.dial_code}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-results">No countries found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="form-row phone-row">
                                <div className="input-group code-group">
                                    <input
                                        type="text"
                                        name="code"
                                        id="country_code"
                                        autoComplete="tel-country-code"
                                        placeholder=" "
                                        onChange={handleChange}
                                        value={formData.code}
                                        required
                                    />
                                    <label htmlFor="country_code">Code</label>
                                </div>
                                <div className="input-group number-group">
                                    <input
                                        type="tel"
                                        name="mobile"
                                        id="mobile_number"
                                        autoComplete="tel-national"
                                        placeholder=" "
                                        onChange={handleChange}
                                        value={formData.mobile}
                                        required
                                    />
                                    <label htmlFor="mobile_number">Mobile Number</label>
                                    <i className="fas fa-phone input-icon"></i>
                                </div>
                            </div>


                            <div className="trust-badges">
                                <div className="badge"><i className="fas fa-lock text-green"></i> Secure Checkout</div>
                                <div className="badge"><i className="fas fa-check-circle text-blue"></i> Instant Confirmation</div>
                                <div className="badge"><i className="fas fa-tag text-red"></i> Best Price Guarantee</div>
                            </div>

                            <button type="submit" className="btn-continue" style={{ backgroundColor: '#25D366' }}>
                                Continue to payment at WhatsApp <i className="fab fa-whatsapp" style={{ fontSize: '1.2em', marginLeft: '8px' }}></i>
                            </button>
                        </form>

                        <div className="location-map" style={{ marginTop: '25px', borderRadius: '10px', overflow: 'hidden' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#1e293b' }}>
                                <i className="fas fa-map-marked-alt" style={{ color: '#0ea5e9' }}></i> Departure Location
                            </h4>
                            <iframe 
                                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} 
                                width="100%" 
                                height="200" 
                                style={{ border: 0, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
                                allowFullScreen="" 
                                loading="lazy"
                                title="Departure Jetty Map">
                            </iframe>
                            {displayIslandName === 'kapas' && (
                                <a 
                                    href="https://maps.app.goo.gl/ZBBPpGgvBBVtnwbC7" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ display: 'inline-block', marginTop: '10px', fontSize: '0.9rem', color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}
                                >
                                    <i className="fas fa-external-link-alt"></i> Open in Google Maps
                                </a>
                            )}
                        </div>
                    </div>
                    <p className="terms-agreement">By proceeding, you agree to ILand's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.</p>
                </div>

                {/* RIGHT COLUMN: Summary */}
                <div className="checkout-sidebar">
                    <div className="summary-card sticky">
                        <div className="summary-cover" style={{ backgroundImage: `url(${image})` }}>
                            <div className="summary-overlay">
                                <span className="location-tag"><i className="fas fa-map-marker-alt"></i> {renderJettyName}</span>
                            </div>
                        </div>

                        <div className="summary-body">
                            {renderJettyName === 'Neill Boat Services Jetty' && (
                                <div style={{ marginBottom: '15px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                                    <div style={{ padding: '8px 12px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fas fa-ship" style={{ color: '#0ea5e9' }}></i> Departure: Neill Boat Services Jetty
                                    </div>
                                    <img src="/images/merang_jetty.png" alt="Neill Boat Services Jetty" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
                                </div>
                            )}
                            <h3 className="package-title">{title}</h3>

                            <div className="summary-details">
                                <div className="detail-item">
                                    <i className="far fa-calendar-alt"></i>
                                    <div>
                                        <span className="label">Date</span>
                                        <span className="value">
                                            {selectedDate && !isNaN(new Date(selectedDate).getTime())
                                                ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                                                : 'Not selected'}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <i className="far fa-user"></i>
                                    <div>
                                        <span className="label">Guests</span>
                                        <span className="value">{adultCount} Adult{adultCount > 1 ? 's' : ''}, {childCount} Child{childCount > 1 ? 'ren' : ''}</span>
                                    </div>
                                </div>
                            </div>

                            {description && (
                                <div className="spots-included">
                                    <h4><i className="fas fa-map"></i> Spots Included:</h4>
                                    <p>{description}</p>
                                </div>
                            )}

                            {customFeatures.length > 0 && (
                                <div className="inclusions">
                                    <h4><i className="fas fa-box-open"></i> Package Includes:</h4>
                                    <ul>
                                        {customFeatures.map((f, i) => (
                                            <li key={i}><i className={f.icon || 'fas fa-check text-green'}></i> {f.text}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="price-breakdown">
                                <div className="price-row crossed-out">
                                    <span>Original Price</span>
                                    <span>RM {originalPrice !== '0.00' ? originalPrice : (parseFloat(totalPrice || 0) * 1.3).toFixed(2)}</span>
                                </div>
                                <div className="price-row total">
                                    <span>Total Due</span>
                                    <div className="total-amount">
                                        <span className="currency">RM</span>
                                        <span className="amount">{totalPrice}</span>
                                        <small className="taxes">Includes taxes & fees</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversalContactDetails;
