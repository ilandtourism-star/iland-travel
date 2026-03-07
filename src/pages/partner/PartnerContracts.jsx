import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerContracts = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [contracts] = useState([
        { id: 'CTR-2023-001', name: 'General Partnership Agreement', status: 'Active', dateSigned: '2023-01-01', validUntil: '2023-12-31' },
        { id: 'CTR-2022-001', name: 'General Partnership Agreement', status: 'Expired', dateSigned: '2022-01-01', validUntil: '2022-12-31' },
        { id: 'NDA-2022-001', name: 'Non-Disclosure Agreement', status: 'Active', dateSigned: '2022-01-01', validUntil: 'Indefinite' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return '#48bb78';
            case 'Expired': return '#718096';
            case 'Signed': return '#3182ce';
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Contracts</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>View and manage your signed agreements.</p>
                    </div>
                </div>

                <div className="card-simple" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contract Name</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contract ID</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Signed</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valid Until</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contracts.map((contract, index) => (
                                    <tr key={contract.id} style={{ borderBottom: index < contracts.length - 1 ? '1px solid #edf2f7' : 'none', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2d3748', fontWeight: '500' }}>{contract.name}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#718096', fontFamily: 'monospace' }}>{contract.id}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: '9999px',
                                                fontSize: '0.8rem', fontWeight: '600',
                                                background: `${getStatusColor(contract.status)}20`, color: getStatusColor(contract.status)
                                            }}>
                                                {contract.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#4a5568' }}>{contract.dateSigned}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#4a5568' }}>{contract.validUntil}</td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                                View
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

export default PartnerContracts;
