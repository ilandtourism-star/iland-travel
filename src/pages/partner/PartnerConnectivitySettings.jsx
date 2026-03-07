import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerConnectivitySettings = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [connectedApps] = useState([
        { id: 1, name: 'Google Calendar', status: 'Connected', lastSync: '10 mins ago' },
        { id: 2, name: 'Airbnb', status: 'Disconnected', lastSync: 'N/A' },
        { id: 3, name: 'Booking.com', status: 'Connected', lastSync: '1 hour ago' },
        { id: 4, name: 'Expedia', status: 'Disconnected', lastSync: 'N/A' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Connected': return '#48bb78';
            case 'Disconnected': return '#718096';
            default: return '#a0aec0';
        }
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Connectivity Settings</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Manage your connections with third-party platforms and calendars.</p>
                    </div>
                    <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                        <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Add New Connection
                    </button>
                </div>

                <div className="card-simple" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Name</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Sync</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {connectedApps.map((app, index) => (
                                    <tr key={app.id} style={{ borderBottom: index < connectedApps.length - 1 ? '1px solid #edf2f7' : 'none', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2d3748', fontWeight: '500' }}>{app.name}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: '9999px',
                                                fontSize: '0.8rem', fontWeight: '600',
                                                background: `${getStatusColor(app.status)}20`, color: getStatusColor(app.status)
                                            }}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#718096' }}>{app.lastSync}</td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                                Configure
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerConnectivitySettings;
