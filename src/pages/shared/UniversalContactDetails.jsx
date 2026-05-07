import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { secureFetch } from '../../lib/api';
import { countries } from '../../lib/countries';
import { useRef } from 'react';

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

        const bookingPayload = {
            firstName: `${formData.firstname} ${formData.lastname}`,
            email: formData.email,
            packageName: packageData?.name || initialTitle,
            vacation_sku: vacation_sku,
            date: selectedDate ? new Date(selectedDate).toISOString() : null,
            adults: Number(adultCount),
            children: Number(childCount),
            pax: pax,
            totalPrice: totalPrice
        };

        try {
            const response = await secureFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(bookingPayload)
            });

            const data = await response.json();

            if (response.ok) {
                addToast('Maklumat Disimpan!', 'success');
                navigate('/checkout', {
                    state: {
                        bookingId: data.booking.id,
                        packageName: packageData?.name || initialTitle,
                        date: selectedDate,
                        pax: pax,
                        totalPrice: totalPrice,
                        vacation_sku: vacation_sku
                    }
                });
            } else {
                addToast(data.message || 'Tempahan Gagal. Sila cuba lagi.', 'error');
            }
        } catch (err) {
            console.error("Booking Error:", err);
            addToast('Ralat Rangkaian. Sila pastikan server dibuka.', 'error');
        }
    };

    const title = packageData?.name || initialTitle;
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

    // Inject custom features for all packages
    let customFeatures = [...features];
    if (!customFeatures.some(f => f.text.includes('Time :') || f.text.includes('Pick up jetty'))) {
        let timeText = 'Time : 8.00am-4.00pm';
        const isSquidJigging = packageData?.category === 'squid_jigging' || (packageData?.name || initialTitle).toLowerCase().includes('squid');
        if (isSquidJigging) {
            timeText = 'Time : 5.00pm-6.00am';
        }
        customFeatures.push({ icon: 'fas fa-clock', text: timeText });
        
        const islandName = (packageData?.island || '').toLowerCase();
        let jettyName = 'Merang Waterfront Jetty';
        if (islandName === 'kapas') jettyName = 'Jeti Marang';
        else if (islandName === 'perhentian') jettyName = 'Kuala Besut Jetty';
        
        customFeatures.push({ icon: 'fas fa-map-marker-alt', text: `Pick up jetty : ${jettyName}` });
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

                            <button type="submit" className="btn-continue">
                                Continue to Payment <i className="fas fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>
                    <p className="terms-agreement">By proceeding, you agree to ILand's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.</p>
                </div>

                {/* RIGHT COLUMN: Summary */}
                <div className="checkout-sidebar">
                    <div className="summary-card sticky">
                        <div className="summary-cover" style={{ backgroundImage: `url(${image})` }}>
                            <div className="summary-overlay">
                                <span className="location-tag"><i className="fas fa-map-marker-alt"></i> {packageData?.island} Island</span>
                            </div>
                        </div>

                        <div className="summary-body">
                            <h3 className="package-title">{title}</h3>

                            <div className="summary-details">
                                <div className="detail-item">
                                    <i className="far fa-calendar-alt"></i>
                                    <div>
                                        <span className="label">Date</span>
                                        <span className="value">
                                            {selectedDate && !isNaN(new Date(selectedDate).getTime())
                                                ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
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
