import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import PartnerNavbar from '../../components/layout/PartnerNavbar';

const PartnerEquipmentService = () => {
    const navigate = useNavigate();
    // Mock Activity Data
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
    };
    const { addToast } = useToast();

    const [facilities, setFacilities] = useState([
        { id: 1, name: 'Snorkeling Equipment', enabled: true, description: 'Masks, snorkels, and fins provided.' },
        { id: 2, name: 'Life Jackets', enabled: true, description: 'Safety vests for all ages.' },
        { id: 3, name: 'Towels', enabled: false, description: 'Fresh towels for guests.' },
        { id: 4, name: 'Underwater Camera', enabled: false, description: 'GoPro or similar for rent.' },
        { id: 5, name: 'Lunch / Snacks', enabled: true, description: 'Packed lunch or light refreshments.' },
        { id: 6, name: 'Hotel Pickup', enabled: false, description: 'Transfer from hotel to jetty.' },
        { id: 7, name: 'Showers', enabled: false, description: 'Shower facilities at the jetty/base.' },
        { id: 8, name: 'Lockers', enabled: false, description: 'Secure storage for valuables.' }
    ]);

    const toggleFacility = (id, value) => {
        setFacilities(facilities.map(f =>
            f.id === id ? { ...f, enabled: value } : f
        ));
    };

    return (
        <div className="partner-equipment-wrapper">
            <PartnerNavbar />


            <div className="container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="nav-card">
                        <div className="nav-header">Activity Information</div>
                        <div className="step done" onClick={() => navigate('/partner/activity-details')}>Details</div>
                        <div className="step done" onClick={() => navigate('/partner/one-package-detail')}>Meeting Point</div>
                        <div className="step done" onClick={() => navigate('/partner/departure-time')}>Departure Time</div>
                        <div className="step done" onClick={() => navigate('/partner/spots')}>Spots</div>
                        <div className="step active" onClick={() => navigate('/partner/equipment-service')}>Equipment & Service</div>
                        <div className="step" onClick={() => navigate('/partner/pricing')}>Pricing</div>
                        <div className="step" onClick={() => navigate('/partner/photos')}>Photos</div>
                        <div className="step" onClick={() => navigate('/partner/publish')}>Publish</div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <div className="content-card">
                        <h1>Equipment & Services</h1>
                        <p className="subtitle">Specify what is included or available for your guests.</p>

                        <hr />

                        <div className="section-box">
                            <div className="section-title">
                                <i className="fas fa-concierge-bell"></i>
                                <h3>Facilities & Inclusions</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {facilities.map(facility => (
                                    <div key={facility.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f7fafc' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '1rem', marginBottom: '4px' }}>{facility.name}</div>
                                            <div style={{ color: '#718096', fontSize: '0.9rem' }}>{facility.description}</div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '4px', background: '#edf2f7', padding: '4px', borderRadius: '6px' }}>
                                            <button
                                                onClick={() => toggleFacility(facility.id, true)}
                                                style={{
                                                    padding: '6px 16px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    background: facility.enabled ? 'white' : 'transparent',
                                                    color: facility.enabled ? '#3182ce' : '#718096',
                                                    fontWeight: facility.enabled ? '600' : '500',
                                                    boxShadow: facility.enabled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => toggleFacility(facility.id, false)}
                                                style={{
                                                    padding: '6px 16px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    background: !facility.enabled ? 'white' : 'transparent',
                                                    color: !facility.enabled ? '#e53e3e' : '#718096',
                                                    fontWeight: !facility.enabled ? '600' : '500',
                                                    boxShadow: !facility.enabled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Nav */}
                    <div className="partner-footer-actions">
                        <button className="partner-btn-secondary" onClick={() => navigate(-1)}>Back</button>
                        <button className="partner-btn-primary" onClick={() => {
                            const hasEnabledFacility = facilities.some(f => f.enabled);
                            if (!hasEnabledFacility) {
                                addToast('Sila pilih sekurang-kurangnya satu kemudahan atau perkhidmatan.', 'error');
                                return;
                            }
                            navigate('/partner/pricing');
                        }}>Next</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerEquipmentService;
