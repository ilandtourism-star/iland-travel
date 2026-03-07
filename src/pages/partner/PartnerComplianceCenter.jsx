import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerComplianceCenter = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [complianceItems] = useState([
        { id: 1, title: 'Business License Verification', status: 'Verified', date: '2023-01-15' },
        { id: 2, title: 'Insurance Policy Update', status: 'Pending Review', date: '2023-11-20' },
        { id: 3, title: 'Safety Standards Audit', status: 'Verified', date: '2023-06-10' },
        { id: 4, title: 'Tax Compliance Form', status: 'Action Required', date: '2023-12-01' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified': return '#48bb78';
            case 'Pending Review': return '#ecc94b';
            case 'Action Required': return '#e53e3e';
            default: return '#718096';
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Compliance Center</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Monitor and manage your regulatory and policy compliance.</p>
                    </div>
                </div>

                <div className="card-simple" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Compliance Status</h2>
                        <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                            Overall Status: <span style={{ color: '#ecc94b', fontWeight: '600' }}>Attention Needed</span>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirement</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Updated</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complianceItems.map((item, index) => (
                                    <tr key={item.id} style={{ borderBottom: index < complianceItems.length - 1 ? '1px solid #edf2f7' : 'none', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2d3748', fontWeight: '500' }}>{item.title}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: '9999px',
                                                fontSize: '0.8rem', fontWeight: '600',
                                                background: `${getStatusColor(item.status)}20`, color: getStatusColor(item.status)
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#4a5568' }}>{item.date}</td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '24px', padding: '20px', background: '#ebf8ff', borderRadius: '8px', border: '1px solid #bee3f8' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                        <i className="fas fa-info-circle" style={{ fontSize: '1.2rem', color: '#3182ce', marginTop: '2px' }}></i>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2c5282', marginTop: 0, marginBottom: '4px' }}>Need Help?</h3>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#2b6cb0' }}>
                                If you have questions about specific compliance requirements, please visit our <a href="#" style={{ color: '#2b6cb0', fontWeight: '600' }}>Partner Help Center</a> or contact support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerComplianceCenter;
