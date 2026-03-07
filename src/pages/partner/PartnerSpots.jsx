import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import PartnerNavbar from '../../components/layout/PartnerNavbar';

const PartnerSpots = () => {
    const navigate = useNavigate();
    const [spots, setSpots] = useState(['']);
    const { addToast } = useToast();

    const handleAddSpot = () => {
        setSpots([...spots, '']);
    };

    const handleSpotChange = (index, value) => {
        const newSpots = [...spots];
        newSpots[index] = value;
        setSpots(newSpots);
    };

    const handleRemoveSpot = (index) => {
        setSpots(spots.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        const validSpots = spots.filter(s => s.trim() !== '');
        if (validSpots.length === 0) {
            addToast('Sila masukkan sekurang-kurangnya satu tempat snorkeling.', 'error');
            return;
        }
        console.log('Snorkeling Spots saved:', validSpots);
        navigate('/partner/equipment-service');
    };

    return (
        <div className="partner-equipment-wrapper">
            <PartnerNavbar />
            {/* Header */}


            <div className="container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="nav-card">
                        <div className="nav-header">Activity Information</div>
                        <div className="step done" onClick={() => navigate('/partner/activity-details')}>Details</div>
                        <div className="step done" onClick={() => navigate('/partner/one-package-detail')}>Meeting Point</div>
                        <div className="step done" onClick={() => navigate('/partner/departure-time')}>Departure Time</div>
                        <div className="step active" onClick={() => navigate('/partner/spots')}>Spots</div>
                        <div className="step" onClick={() => navigate('/partner/equipment-service')}>Equipment & Service</div>
                        <div className="step" onClick={() => navigate('/partner/pricing')}>Pricing</div>
                        <div className="step" onClick={() => navigate('/partner/photos')}>Photos</div>
                        <div className="step" onClick={() => navigate('/partner/publish')}>Publish</div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <div className="content-card">
                        <h1>Where will the snorkeling take place?</h1>
                        <p className="subtitle">List the beautiful spots your guests will explore during the trip.</p>

                        <hr />

                        <div className="section-box">
                            <div className="section-title">
                                <i className="fas fa-map-marker-alt"></i>
                                <h3>Snorkeling Spots</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                                Add the names of all snorkeling points included in this package.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                                {spots.map((spot, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={spot}
                                            onChange={(e) => handleSpotChange(index, e.target.value)}
                                            placeholder="e.g. Coral Garden"
                                            style={{
                                                padding: '10px',
                                                borderRadius: '6px',
                                                border: '1px solid #ccc',
                                                flexGrow: 1,
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                        {spots.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveSpot(index)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ff4d4f',
                                                    cursor: 'pointer',
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={handleAddSpot}
                                    style={{
                                        marginTop: '10px',
                                        background: '#f0f5ff',
                                        color: '#5392f9',
                                        border: '1px dashed #5392f9',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    + Add another spot
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Nav */}
                    <div className="partner-footer-actions">
                        <button className="partner-btn-secondary" onClick={() => navigate(-1)}>Back</button>
                        <button className="partner-btn-primary" onClick={handleNext}>Next</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerSpots;
