import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerPastPayouts = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [payouts] = useState([
        { id: 'PAY-2023-001', date: '2023-10-15', amount: 1250.00, status: 'Completed', method: 'Bank Transfer' },
        { id: 'PAY-2023-002', date: '2023-10-31', amount: 980.50, status: 'Completed', method: 'Bank Transfer' },
        { id: 'PAY-2023-003', date: '2023-11-15', amount: 1540.00, status: 'Completed', method: 'Bank Transfer' },
        { id: 'PAY-2023-004', date: '2023-11-30', amount: 800.00, status: 'Completed', method: 'Bank Transfer' },
        { id: 'PAY-2023-005', date: '2023-12-15', amount: 1100.00, status: 'Completed', method: 'Bank Transfer' },
        { id: 'PAY-2023-006', date: '2023-12-31', amount: 1350.00, status: 'Completed', method: 'Bank Transfer' },
    ]);

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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Past Payouts</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Archive of all settlements transferred to your account.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', background: 'white' }}>
                            <option>All Years</option>
                            <option>2023</option>
                            <option>2022</option>
                        </select>
                        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            <i className="fas fa-download" style={{ marginRight: '8px' }}></i> Download Report
                        </button>
                    </div>
                </div>

                <div className="card-simple" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payout Date</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference ID</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Method</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount (MYR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map((payout, index) => (
                                    <tr key={payout.id} style={{ borderBottom: index < payouts.length - 1 ? '1px solid #edf2f7' : 'none', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2d3748' }}>{payout.date}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2b6cb0', fontWeight: '500' }}>#{payout.id}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#4a5568' }}>{payout.method}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: '9999px',
                                                fontSize: '0.8rem', fontWeight: '600',
                                                background: '#c6f6d5', color: '#2f855a'
                                            }}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '600', color: '#2d3748' }}>
                                            {payout.amount.toFixed(2)}
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

export default PartnerPastPayouts;
