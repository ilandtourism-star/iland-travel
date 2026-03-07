import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png'; // Mock image

const PartnerBookingSettings = () => {
    // Mock Activity Data
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [bookingMethod, setBookingMethod] = useState('instant');
    const [cancellationPolicy, setCancellationPolicy] = useState('free_24h');
    const [noticePeriod, setNoticePeriod] = useState(1);

    return (
        <>
            <ActivityNavbar
                activityName={activityData.name}
                activityId={activityData.id}
                activityImage={activityData.image}
            />
            <div className="activity-dashboard-container">
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Booking Settings</h1>
                    <p style={{ color: '#718096', marginTop: '4px' }}>Configure how guests can book your activity and your policies.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>

                    {/* Section 1: How can guests book your activity? */}
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#2d3748' }}>
                            How can guests book your activity?
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: bookingMethod === 'instant' ? '1px solid #3182ce' : '1px solid #e2e8f0', borderRadius: '8px', background: bookingMethod === 'instant' ? '#ebf8ff' : 'white' }}>
                                <input
                                    type="radio"
                                    name="bookingMethod"
                                    value="instant"
                                    checked={bookingMethod === 'instant'}
                                    onChange={() => setBookingMethod('instant')}
                                    style={{ marginTop: '4px' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '600', color: '#2d3748' }}>Instant Booking (Recommended)</div>
                                    <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '2px' }}>Guests booking are automatically confirmed. No manual approval needed.</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: bookingMethod === 'enquiry' ? '1px solid #3182ce' : '1px solid #e2e8f0', borderRadius: '8px', background: bookingMethod === 'enquiry' ? '#ebf8ff' : 'white' }}>
                                <input
                                    type="radio"
                                    name="bookingMethod"
                                    value="enquiry"
                                    checked={bookingMethod === 'enquiry'}
                                    onChange={() => setBookingMethod('enquiry')}
                                    style={{ marginTop: '4px' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '600', color: '#2d3748' }}>Manual Approval</div>
                                    <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '2px' }}>You need to manually accept or decline each booking request within 24 hours.</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Section 2: What is the cancellation policy? */}
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#2d3748' }}>
                            What is the cancellation policy?
                        </h2>
                        <div style={{ marginBottom: '16px' }}>
                            <select
                                value={cancellationPolicy}
                                onChange={(e) => setCancellationPolicy(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem' }}
                            >
                                <option value="free_24h">Free cancellation up to 24 hours before</option>
                                <option value="free_48h">Free cancellation up to 48 hours before</option>
                                <option value="free_7d">Free cancellation up to 7 days before</option>
                                <option value="non_refundable">Non-refundable</option>
                            </select>
                        </div>
                        <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '8px', border: '1px solid #edf2f7' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>Policy Details:</div>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0, color: '#718096', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                <li>Full refund if cancelled at least 24 hours before the activity starts.</li>
                                <li>No refund if cancelled less than 24 hours before the activity starts.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3: How many days notice do you need before a guest arrives? */}
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#2d3748' }}>
                            How many days notice do you need before a guest arrives?
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <select
                                value={noticePeriod}
                                onChange={(e) => setNoticePeriod(e.target.value)}
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem', width: '200px' }}
                            >
                                <option value={0}>Same day (0 days)</option>
                                <option value={1}>1 day</option>
                                <option value={2}>2 days</option>
                                <option value={3}>3 days</option>
                                <option value={7}>7 days</option>
                            </select>
                            <span style={{ color: '#718096', fontSize: '0.95rem' }}>If you select "Same day", guests can book up until the start time.</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '16px' }}>
                        <button className="btn-primary" style={{ padding: '12px 32px' }}>Save Changes</button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PartnerBookingSettings;
