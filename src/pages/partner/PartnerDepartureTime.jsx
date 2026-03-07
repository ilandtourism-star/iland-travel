import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import PartnerNavbar from '../../components/layout/PartnerNavbar';

const PartnerDepartureTime = () => {
    const navigate = useNavigate();
    const [timeSlots, setTimeSlots] = useState(['']);
    const { addToast } = useToast();

    const handleAddTime = () => {
        setTimeSlots([...timeSlots, '']);
    };

    const handleTimeChange = (index, value) => {
        const newSlots = [...timeSlots];
        newSlots[index] = value;
        setTimeSlots(newSlots);
    };

    const handleRemoveTime = (index) => {
        setTimeSlots(timeSlots.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        const validSlots = timeSlots.filter(t => t.trim() !== '');
        if (validSlots.length === 0) {
            addToast('Sila masukkan sekurang-kurangnya satu masa perlepasan.', 'error');
            return;
        }
        console.log('Departure Times saved:', validSlots);
        navigate('/partner/spots');
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
                        <div className="step active" onClick={() => navigate('/partner/departure-time')}>Departure Time</div>
                        <div className="step" onClick={() => navigate('/partner/spots')}>Spots</div>
                        <div className="step" onClick={() => navigate('/partner/equipment-service')}>Equipment & Service</div>
                        <div className="step" onClick={() => navigate('/partner/pricing')}>Pricing</div>
                        <div className="step" onClick={() => navigate('/partner/photos')}>Photos</div>
                        <div className="step" onClick={() => navigate('/partner/publish')}>Publish</div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <div className="content-card">
                        <h1>What is your activity schedule?</h1>
                        <p className="subtitle">Guests need to know exactly when the activity starts to plan their trip.</p>

                        <hr />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
                            {/* Left Column: Schedule Form */}
                            <div className="section-box" style={{ border: 'none', padding: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                            <div style={{ background: '#e2e8f0', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5568' }}>
                                                <i className="fas fa-clock" style={{ fontSize: '1.2rem' }}></i>
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>Departure Times</h3>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#718096' }}>Add all available start times for this activity</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {timeSlots.map((time, index) => (
                                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                                    <div style={{ color: '#a0aec0', fontWeight: 'bold', width: '24px' }}>{index + 1}.</div>
                                                    <input
                                                        type="time"
                                                        value={time}
                                                        onChange={(e) => handleTimeChange(index, e.target.value)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e2e8f0',
                                                            flexGrow: 1,
                                                            fontSize: '1.05rem',
                                                            fontFamily: 'inherit',
                                                            color: '#2d3748',
                                                            background: '#f8fafc'
                                                        }}
                                                    />
                                                    {timeSlots.length > 1 && (
                                                        <button
                                                            onClick={() => handleRemoveTime(index)}
                                                            style={{
                                                                background: '#fff5f5',
                                                                border: '1px solid #fed7d7',
                                                                color: '#e53e3e',
                                                                cursor: 'pointer',
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            title="Remove Time Slot"
                                                            onMouseEnter={(e) => e.target.style.background = '#fed7d7'}
                                                            onMouseLeave={(e) => e.target.style.background = '#fff5f5'}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            <button
                                                onClick={handleAddTime}
                                                style={{
                                                    background: '#fff',
                                                    color: '#5392f9',
                                                    border: '1px dashed #5392f9',
                                                    padding: '14px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    fontSize: '0.95rem'
                                                }}
                                                onMouseEnter={(e) => Object.assign(e.target.style, { background: '#f0f6ff', borderColor: '#3b7ce3' })}
                                                onMouseLeave={(e) => Object.assign(e.target.style, { background: '#fff', borderColor: '#5392f9' })}
                                            >
                                                <i className="fas fa-plus-circle"></i> Add another time slot
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Right Column: Tips Widget */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ padding: '20px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <i className="fas fa-lightbulb" style={{ color: '#16a34a', fontSize: '1.2rem' }}></i>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, color: '#166534' }}>Best Practices</h3>
                                    </div>
                                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: '#15803d', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
                                        <li>Ensure you set accurate departure times to avoid guest frustration.</li>
                                        <li>If your schedule changes seasonally, remember to update these settings.</li>
                                        <li>Multiple time slots give guests more flexibility to book your activity.</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px', marginTop: 0, color: '#4a5568' }}>Note on Availability</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0, lineHeight: '1.5' }}>
                                        Guests must arrive <strong>at least 15 minutes</strong> before the scheduled departure time. We will include this reminder in their booking confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="partner-footer-actions" style={{ marginTop: '48px' }}>
                            <button className="partner-btn-secondary" onClick={() => navigate(-1)}>Back</button>
                            <button className="partner-btn-primary" onClick={handleNext}>Next: Spots</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerDepartureTime;
