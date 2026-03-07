import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import { secureFetch } from '../../lib/api';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ revenue: 0, bookings: 0 });

    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await secureFetch('/api/v1/partner/transactions', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                }

                // Also fetch stats for header
                const statsRes = await secureFetch('/api/v1/partner/analytics', { credentials: 'include' });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getAmountColor = (type, amount) => {
        if (type === 'Payout' || type === 'Refund' || amount < 0) return '#e53e3e';
        return '#48bb78';
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>All Transactions</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>A detailed log of all financial movements.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="date" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            <i className="fas fa-filter" style={{ marginRight: '8px' }}></i> Filter
                        </button>
                    </div>
                </div>

                <div className="card-simple" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transaction ID</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross (MYR)</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ref/Comm (MYR)</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net (MYR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn, index) => (
                                    <tr key={txn.id} style={{ borderBottom: index < transactions.length - 1 ? '1px solid #edf2f7' : 'none', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2d3748' }}>{txn.date}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#718096', fontFamily: 'monospace' }}>{txn.id}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '2px 10px', borderRadius: '4px',
                                                fontSize: '0.8rem', fontWeight: '600', background: '#edf2f7', color: '#4a5568'
                                            }}>
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2d3748' }}>{txn.description}</td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '500' }}>
                                            {txn.amount > 0 ? txn.amount.toFixed(2) : '-'}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.95rem', color: '#e53e3e' }}>
                                            {txn.commission > 0 ? `-${txn.commission.toFixed(2)}` : '-'}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: getAmountColor(txn.type, txn.net_amount || txn.amount) }}>
                                            {(txn.net_amount || txn.amount).toFixed(2)}
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

export default PartnerTransactions;
