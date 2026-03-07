import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png'; // Mock image

const PartnerPromotion = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');

    // Mock Activity Data
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const recommendedPromotions = [
        {
            id: 'rec-1',
            title: 'Early Bird Discount',
            description: 'Encourage guests to book early. Offer a 10% discount for bookings made 30 days in advance.',
            tag: 'Recommended'
        },
        {
            id: 'rec-2',
            title: 'Last Minute Deal',
            description: 'Fill up your empty slots. Offer a 20% discount for bookings made within 2 days of the activity.',
            tag: 'Popular'
        }
    ];

    const activePromotions = [
        {
            id: 'promo-1',
            name: 'Summer Sale 2025',
            discount: '15%',
            dates: '01 Jun 2025 - 31 Aug 2025',
            bookings: 12,
            revenue: 'MYR 2,400'
        }
    ];

    const inactivePromotions = [
        {
            id: 'promo-old-1',
            name: 'New Year Special',
            discount: '20%',
            dates: '01 Jan 2025 - 15 Jan 2025',
            bookings: 45,
            revenue: 'MYR 8,500'
        }
    ];

    return (
        <>
            <ActivityNavbar
                activityName={activityData.name}
                activityId={activityData.id}
                activityImage={activityData.image}
            />
            <div className="activity-dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Promotions</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Boost your visibility and bookings with special offers.</p>
                    </div>
                    <button className="btn-action-primary">
                        <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Choose promotion
                    </button>
                </div>

                {/* Recommended Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px', color: '#2d3748' }}>Recommended for you</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {recommendedPromotions.map(promo => (
                            <div key={promo.id} className="card-simple" style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#e6fffa', color: '#319795', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                                    {promo.tag}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', paddingRight: '120px' }}>{promo.title}</h3>
                                <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>{promo.description}</p>
                                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Set up promotion</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promotions List (Tabs) */}
                <div className="card-simple" style={{ padding: '0', overflow: 'hidden' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                        <button
                            style={{
                                padding: '16px 24px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'active' ? '2px solid #3182ce' : '2px solid transparent',
                                color: activeTab === 'active' ? '#3182ce' : '#718096',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.95rem'
                            }}
                            onClick={() => setActiveTab('active')}
                        >
                            Active ({activePromotions.length})
                        </button>
                        <button
                            style={{
                                padding: '16px 24px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'inactive' ? '2px solid #3182ce' : '2px solid transparent',
                                color: activeTab === 'inactive' ? '#3182ce' : '#718096',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.95rem'
                            }}
                            onClick={() => setActiveTab('inactive')}
                        >
                            Inactive ({inactivePromotions.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '24px' }}>
                        {activeTab === 'active' ? (
                            activePromotions.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {activePromotions.map(promo => (
                                        <div key={promo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #edf2f7', borderRadius: '8px' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '600' }}>{promo.name}</h4>
                                                <div style={{ color: '#718096', fontSize: '0.85rem' }}>{promo.dates} • <span style={{ color: '#38a169', fontWeight: '500' }}>{promo.discount} Off</span></div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{promo.revenue}</div>
                                                <div style={{ color: '#718096', fontSize: '0.8rem' }}>{promo.bookings} bookings</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
                                    <p>No active promotions.</p>
                                </div>
                            )
                        ) : (
                            inactivePromotions.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {inactivePromotions.map(promo => (
                                        <div key={promo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #edf2f7', borderRadius: '8px', opacity: '0.7' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '600' }}>{promo.name}</h4>
                                                <div style={{ color: '#718096', fontSize: '0.85rem' }}>{promo.dates} • {promo.discount} Off</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{promo.revenue}</div>
                                                <div style={{ color: '#718096', fontSize: '0.8rem' }}>{promo.bookings} bookings</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
                                    <p>No inactive promotions.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerPromotion;
