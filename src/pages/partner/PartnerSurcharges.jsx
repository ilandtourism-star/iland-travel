import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png'; // Mock image

const PartnerSurcharges = () => {
    // Mock Activity Data
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [surcharges, setSurcharges] = useState([
        { id: 1, name: 'Weekend Surcharge', enabled: true, amount: 50, type: 'per booking', description: 'Applies on Friday, Saturday, and Sunday.' },
        { id: 2, name: 'Peak Season Surcharge', enabled: false, amount: 100, type: 'per booking', description: 'Applies during public holidays and school holidays.' },
        { id: 3, name: 'Marine Park Fee', enabled: false, amount: 30, type: 'per person', description: 'Government mandated conservation fee.' },
        { id: 4, name: 'Equipment Rental', enabled: true, amount: 20, type: 'per person', description: 'Optional snorkeling gear rental.' },
        { id: 5, name: 'Cleaning Fee', enabled: false, amount: 15, type: 'per booking', description: 'Cleaning service after the trip.' }
    ]);

    const toggleSurcharge = (id) => {
        setSurcharges(surcharges.map(s =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
        ));
    };

    const updateAmount = (id, newAmount) => {
        setSurcharges(surcharges.map(s =>
            s.id === id ? { ...s, amount: parseInt(newAmount) || 0 } : s
        ));
    };

    return (
        <>
            <ActivityNavbar
                activityName={activityData.name}
                activityId={activityData.id}
                activityImage={activityData.image}
            />
            <div className="activity-dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Surcharges & Fees</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Manage additional fees and surcharges for your activity.</p>
                    </div>
                    <button className="btn-action-primary">
                        <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Add New Surcharge
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>

                    {surcharges.map(surcharge => (
                        <div key={surcharge.id} className="card-simple" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start', opacity: surcharge.enabled ? 1 : 0.8 }}>
                            {/* Toggle Switch */}
                            <div style={{ paddingTop: '4px' }}>
                                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                                    <input
                                        type="checkbox"
                                        checked={surcharge.enabled}
                                        onChange={() => toggleSurcharge(surcharge.id)}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span
                                        className="slider round"
                                        style={{
                                            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: surcharge.enabled ? '#3182ce' : '#ccc',
                                            transition: '.4s', borderRadius: '34px'
                                        }}
                                    >
                                        <span style={{
                                            position: 'absolute', content: "", height: '16px', width: '16px', left: '4px', bottom: '4px',
                                            backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                            transform: surcharge.enabled ? 'translateX(24px)' : 'translateX(0)'
                                        }}></span>
                                    </span>
                                </label>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: surcharge.enabled ? '#2d3748' : '#718096' }}>{surcharge.name}</h3>
                                    {surcharge.enabled && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>MYR</span>
                                            <input
                                                type="number"
                                                value={surcharge.amount}
                                                onChange={(e) => updateAmount(surcharge.id, e.target.value)}
                                                style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0', textAlign: 'right' }}
                                            />
                                            <span style={{ fontSize: '0.9rem', color: '#718096' }}>/ {surcharge.type}</span>
                                        </div>
                                    )}
                                </div>
                                <p style={{ margin: 0, color: '#718096', fontSize: '0.95rem' }}>{surcharge.description}</p>
                            </div>
                        </div>
                    ))}

                    <div style={{ textAlign: 'right', marginTop: '16px' }}>
                        <button className="btn-primary" style={{ padding: '12px 32px' }}>Save Changes</button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PartnerSurcharges;
