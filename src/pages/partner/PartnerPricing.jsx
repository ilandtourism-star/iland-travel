import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import PartnerNavbar from '../../components/layout/PartnerNavbar';

const PartnerPricing = () => {
    const navigate = useNavigate();
    const [pricing, setPricing] = useState({
        adultPrice: '',
        childPrice: '',
        currency: 'MYR'
    });
    const { addToast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPricing(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (!pricing.adultPrice) {
            addToast('Sila masukkan Harga Dewasa sebelum meneruskan.', 'error');
            return;
        }
        console.log('Pricing Data saved:', pricing);
        navigate('/partner/photos');
    };

    return (
        <div className="partner-equipment-wrapper">
            <PartnerNavbar />


            <div className="container">
                {/* Sidebar Navigation */}
                <aside className="sidebar">
                    <div className="nav-card">
                        <div className="nav-header">Activity Information</div>
                        <div className="step done" onClick={() => navigate('/partner/activity-details')}>Details</div>
                        <div className="step done" onClick={() => navigate('/partner/one-package-detail')}>Meeting Point</div>
                        <div className="step done" onClick={() => navigate('/partner/departure-time')}>Departure Time</div>
                        <div className="step done" onClick={() => navigate('/partner/spots')}>Spots</div>
                        <div className="step done" onClick={() => navigate('/partner/equipment-service')}>Equipment & Service</div>
                        <div className="step active" onClick={() => navigate('/partner/pricing')}>Pricing</div>
                        <div className="step" onClick={() => navigate('/partner/photos')}>Photos</div>
                        <div className="step" onClick={() => navigate('/partner/publish')}>Publish</div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                    <div className="content-card">
                        <h1>Pricing Settings</h1>
                        <p className="subtitle">
                            Set your competitive pricing to attract more guests. Prices should include all taxes.
                        </p>

                        <hr />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
                            {/* Left Column: Pricing Form */}
                            <div className="section-box" style={{ border: 'none', padding: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div className="input-group">
                                            <label style={{ fontWeight: '600', marginBottom: '10px', display: 'block', color: '#4a5568', fontSize: '0.95rem' }}>Adult Price (per person)</label>
                                            <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                                <div style={{
                                                    background: '#edf2f7',
                                                    border: '1px solid #cbd5e0',
                                                    borderRight: 'none',
                                                    padding: '0 16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    borderRadius: '8px 0 0 8px',
                                                    color: '#4a5568',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem'
                                                }}>MYR</div>
                                                <input
                                                    type="number"
                                                    name="adultPrice"
                                                    value={pricing.adultPrice}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                    style={{
                                                        flexGrow: 1,
                                                        padding: '12px 16px',
                                                        borderRadius: '0 8px 8px 0',
                                                        border: '1px solid #cbd5e0',
                                                        fontSize: '1.1rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ fontWeight: '600', marginBottom: '10px', display: 'block', color: '#4a5568', fontSize: '0.95rem' }}>Child Price (per person)</label>
                                            <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                                <div style={{
                                                    background: '#edf2f7',
                                                    border: '1px solid #cbd5e0',
                                                    borderRight: 'none',
                                                    padding: '0 16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    borderRadius: '8px 0 0 8px',
                                                    color: '#4a5568',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem'
                                                }}>MYR</div>
                                                <input
                                                    type="number"
                                                    name="childPrice"
                                                    value={pricing.childPrice}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                    style={{
                                                        flexGrow: 1,
                                                        padding: '12px 16px',
                                                        borderRadius: '0 8px 8px 0',
                                                        border: '1px solid #cbd5e0',
                                                        fontSize: '1.1rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '16px', background: '#fff9eb', border: '1px solid #ffeeba', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                                        <i className="fas fa-exclamation-circle" style={{ color: '#856404', marginTop: '3px' }}></i>
                                        <div style={{ fontSize: '0.85rem', color: '#856404', lineHeight: '1.5' }}>
                                            <strong>Tax & Fees:</strong> The prices you set must include all applicable government taxes, service charges, and any other fees. Guests should not pay anything extra at the location.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Tips Widget */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', marginTop: 0 }}>Pricing Tips</h3>
                                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <li>Look at similar activities in your area to set a competitive price.</li>
                                        <li>Consider offering a lower price for children to attract families.</li>
                                        <li>Seasonal pricing can help you maximize bookings during peak periods.</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px', marginTop: 0 }}>Need Help?</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', lineHeight: '1.4' }}>
                                        If you're unsure how to price your activity, contact our support team for a market analysis.
                                    </p>
                                    <button
                                        className="partner-btn-secondary"
                                        style={{ width: '100%', padding: '10px' }}
                                    >
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="partner-footer-actions" style={{ marginTop: '48px' }}>
                            <button className="partner-btn-secondary" onClick={() => navigate(-1)}>Back</button>
                            <button className="partner-btn-primary" onClick={handleNext}>Next</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerPricing;
