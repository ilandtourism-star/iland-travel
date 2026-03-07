import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import { secureFetch } from '../../lib/api';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerPayouts = () => {
    const [stats, setStats] = useState({ revenue: 0, confirmed: 0, pending: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Mock Activity Data
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await secureFetch('/api/v1/partner/analytics', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Error fetching payout stats:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Mock Payout History (Still mock for now as we don't have a payout table yet)
    const [payouts] = useState([
        { id: 'PAY-2023-001', date: '2023-10-15', amount: 1250.00, status: 'Paid', method: 'Bank Transfer' },
        { id: 'PAY-2023-002', date: '2023-10-31', amount: 980.50, status: 'Paid', method: 'Bank Transfer' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return '#48bb78';
            case 'Processing': return '#ecc94b';
            case 'Pending': return '#a0aec0';
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Payouts</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>View your payment history and upcoming payouts.</p>
                    </div>
                </div>

                <div className="card-simple" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Payout History</h2>
                        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            <i className="fas fa-download" style={{ marginRight: '8px' }}></i> Export CSV
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference ID</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Method</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount (MYR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map((payout, index) => (
                                    <tr key={payout.id} style={{ borderBottom: index < payouts.length - 1 ? '1px solid #edf2f7' : 'none', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2b6cb0', fontWeight: '500' }}>#{payout.id}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2d3748' }}>{payout.date}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#4a5568' }}>{payout.method}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: '9999px',
                                                fontSize: '0.8rem', fontWeight: '600',
                                                background: `${getStatusColor(payout.status)}20`, color: getStatusColor(payout.status)
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

                <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '16px' }}>Next Estimated Payout</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2b6cb0' }}>MYR {stats.revenue ? stats.revenue.toFixed(2) : '0.00'}</div>
                        <p style={{ color: '#718096', margin: '4px 0 0 0' }}>Based on {stats.confirmed} confirmed bookings</p>
                    </div>

                    <div className="card-simple" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '16px' }}>Payout Settings</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '32px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096', fontWeight: '600' }}>BANK</div>
                            <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d3748' }}>Maybank •••• 1234</div>
                                <div style={{ fontSize: '0.85rem', color: '#718096' }}>Primary account</div>
                            </div>
                            <button style={{ marginLeft: 'auto', color: '#3182ce', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerPayouts;
