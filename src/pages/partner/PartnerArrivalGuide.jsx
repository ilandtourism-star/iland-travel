import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerArrivalGuide = () => {
    // Mock Activity Data
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [isEditing, setIsEditing] = useState(false);
    const [arrivalData, setArrivalData] = useState({
        meetingPoint: 'Kapas Island Jetty',
        address: 'No 12, Jalan Pantai, 21600 Marang, Terengganu',
        googleMapsLink: 'https://goo.gl/maps/example',
        checkInInstructions: 'Please arrive 15 minutes before departure. Look for the "Kapas Tours" counter near the main entrance.',
        transportTips: 'You can take a bus to Marang Jetty from Kuala Terengganu Bus Terminal (20 mins).',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArrivalData({ ...arrivalData, [name]: value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Arrival Guide</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Help guests find you easily on the day of the activity.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '30px', alignItems: 'start' }}>

                    {/* Left Column: Form */}
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #edf2f7', paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                                Meeting Point & Check-in
                            </h2>
                            <button
                                className="btn-primary"
                                onClick={handleEditToggle}
                                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                            >
                                {isEditing ? 'Save Changes' : 'Edit'}
                            </button>
                        </div>

                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Meeting Point Name</label>
                                    <input
                                        type="text"
                                        name="meetingPoint"
                                        value={arrivalData.meetingPoint}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Full Address</label>
                                    <textarea
                                        name="address"
                                        value={arrivalData.address}
                                        onChange={handleChange}
                                        rows="2"
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Google Maps Link</label>
                                    <input
                                        type="text"
                                        name="googleMapsLink"
                                        value={arrivalData.googleMapsLink}
                                        onChange={handleChange}
                                        placeholder="https://goo.gl/maps/..."
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Check-in Instructions</label>
                                    <textarea
                                        name="checkInInstructions"
                                        value={arrivalData.checkInInstructions}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Tell guests exactly where to go and who to look for."
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Transport Tips (Optional)</label>
                                    <textarea
                                        name="transportTips"
                                        value={arrivalData.transportTips}
                                        onChange={handleChange}
                                        rows="2"
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: '0 0 40px', height: '40px', background: '#ebf8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3182ce' }}>
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>{arrivalData.meetingPoint}</div>
                                        <div style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.5' }}>{arrivalData.address}</div>
                                        {arrivalData.googleMapsLink && (
                                            <a href={arrivalData.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '6px', color: '#3182ce', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '500' }}>
                                                View on Google Maps <i className="fas fa-external-link-alt" style={{ fontSize: '0.8em', marginLeft: '4px' }}></i>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: '0 0 40px', height: '40px', background: '#f0fff4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38a169' }}>
                                        <i className="fas fa-user-check"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>Check-in Instructions</div>
                                        <div style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.5' }}>{arrivalData.checkInInstructions}</div>
                                    </div>
                                </div>

                                {arrivalData.transportTips && (
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ flex: '0 0 40px', height: '40px', background: '#fffaf0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dd6b20' }}>
                                            <i className="fas fa-bus"></i>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>How to get there</div>
                                            <div style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.5' }}>{arrivalData.transportTips}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Preview / Map Placeholder */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="card-simple" style={{ padding: '0', overflow: 'hidden', height: '300px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096', flexDirection: 'column' }}>
                            <i className="fas fa-map-marked-alt" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
                            <span style={{ fontWeight: '600' }}>Map Preview</span>
                            <span style={{ fontSize: '0.85rem', marginTop: '4px' }}>(Interactive map would appear here)</span>
                        </div>

                        <div className="card-simple" style={{ padding: '24px', background: '#ebf8ff', border: '1px solid #bee3f8' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2b6cb0', marginBottom: '8px' }}>Why is this important?</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#2c5282', lineHeight: '1.5' }}>
                                30% of negative reviews are due to guests getting lost or not knowing where to meet. Clear instructions prevent this!
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PartnerArrivalGuide;
