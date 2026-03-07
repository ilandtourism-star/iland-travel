import React, { useState, useEffect } from 'react';
import { secureFetch } from '../../lib/api';

// Import images for mock data
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';
import imgSnorkelKapas from '../../assets/images/kapas island/snorkeling.png';
import imgSquidJigging from '../../assets/images/Squid Jigging/family.png';

const PartnerAnalytics = () => {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [realData, setRealData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await secureFetch('/api/v1/partner/analytics');
                const data = await response.json();
                if (data.success) {
                    setRealData(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fallback to Mock Data if API fails or is empty
    const metrics = [
        {
            title: 'Total Revenue',
            value: realData?.totalRevenue || 'MYR 0',
            change: '+0%',
            trend: 'positive',
            icon: 'fas fa-dollar-sign'
        },
        {
            title: 'Total Bookings',
            value: realData?.totalBookings || '0',
            change: '+0%',
            trend: 'positive',
            icon: 'fas fa-calendar-check'
        },
        // ... previous mock metrics for visualization
        {
            title: 'Page Views',
            value: '3,240',
            change: '-2.1%',
            trend: 'negative',
            icon: 'fas fa-eye'
        },
        {
            title: 'Conversion Rate',
            value: '4.38%',
            change: '+0.5%',
            trend: 'positive',
            icon: 'fas fa-chart-line'
        }
    ];

    // Mock Data for Top Performing Activities
    const topActivities = [
        {
            name: 'Private Family Boat Trip (Kapas)',
            bookings: 45,
            revenue: 'MYR 6,750',
            views: 1200,
            image: imgPrivateBoat
        },
        {
            name: 'Snorkeling at Kapas Island',
            bookings: 68,
            revenue: 'MYR 3,332',
            views: 950,
            image: imgSnorkelKapas
        },
        {
            name: 'Squid Jigging (Redang)',
            bookings: 22,
            revenue: 'MYR 2,368',
            views: 450,
            image: imgSquidJigging
        }
    ];

    return (
        <div className="analytics-dashboard-container">
            {/* Header */}
            <div className="analytics-header">
                <div className="analytics-title">
                    <h1>Analytics Dashboard</h1>
                    <p className="analytics-subtitle">Overview of your property's performance.</p>
                </div>
                <div className="date-range-picker">
                    <i className="far fa-calendar-alt"></i>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: '5px', fontWeight: '500' }}
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Year to Date</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="metrics-grid">
                {metrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                        <div className="metric-header">
                            <span className="metric-title">{metric.title}</span>
                            <div className="metric-icon">
                                <i className={metric.icon}></i>
                            </div>
                        </div>
                        <div className="metric-value">{metric.value}</div>
                        <div className={`metric-change change-${metric.trend}`}>
                            <i className={`fas fa-arrow-${metric.trend === 'positive' ? 'up' : 'down'}`}></i>
                            {metric.change}
                            <span className="change-neutral" style={{ marginLeft: '5px' }}>vs last period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Simulation using CSS */}
            <div className="chart-section">
                <div className="chart-header">
                    <h3 className="chart-title">Revenue Trend</h3>
                </div>
                {/* Simple CSS Bar Chart Placeholder */}
                <div className="chart-placeholder">
                    <div className="chart-bar" style={{ height: '40%' }} data-label="WK1"></div>
                    <div className="chart-bar" style={{ height: '65%' }} data-label="WK2"></div>
                    <div className="chart-bar" style={{ height: '55%' }} data-label="WK3"></div>
                    <div className="chart-bar" style={{ height: '80%' }} data-label="WK4"></div>
                    <div className="chart-bar" style={{ height: '45%' }} data-label="WK5"></div>
                    <div className="chart-bar" style={{ height: '70%' }} data-label="WK6"></div>
                    <div className="chart-bar" style={{ height: '90%' }} data-label="WK7"></div>
                    <div className="chart-bar" style={{ height: '60%' }} data-label="Today"></div>
                </div>
            </div>

            {/* Top Activities Table */}
            <div className="performance-section">
                <div className="chart-header">
                    <h3 className="chart-title">Top Performing Activities</h3>
                </div>
                <div className="table-responsive">
                    <table className="analytics-table">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th style={{ textAlign: 'right' }}>Bookings</th>
                                <th style={{ textAlign: 'right' }}>Views</th>
                                <th style={{ textAlign: 'right' }}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topActivities.map((activity, index) => (
                                <tr key={index}>
                                    <td className="activity-cell">
                                        <img src={activity.image} alt={activity.name} className="activity-thumb" />
                                        <span style={{ fontWeight: '500' }}>{activity.name}</span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>{activity.bookings}</td>
                                    <td style={{ textAlign: 'right' }}>{activity.views}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#2a2a2e' }}>{activity.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PartnerAnalytics;
