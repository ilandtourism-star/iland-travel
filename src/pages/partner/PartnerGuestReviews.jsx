import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png'; // Mock image

const PartnerGuestReviews = () => {
    // Mock Activity Data (Same as Dashboard for context)
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    // Mock Reviews Data
    const reviewsData = {
        averageScore: 4.8,
        totalReviews: 124,
        breakdown: [
            { label: 'Cleanliness', score: 4.9 },
            { label: 'Service', score: 4.8 },
            { label: 'Value', score: 4.7 },
            { label: 'Location', score: 4.9 },
        ],
        reviews: [
            {
                id: 1,
                guestName: 'Sarah Jenkins',
                date: '12 Feb 2025',
                rating: 5.0,
                comment: 'Absolutely amazing experience! The boat was clean and the guide was very friendly. Highly recommended for families.',
                reply: null
            },
            {
                id: 2,
                guestName: 'Ali Hassan',
                date: '10 Feb 2025',
                rating: 4.5,
                comment: 'Great trip, but the pickup was slightly delayed. Otherwise, perfect.',
                reply: 'Thank you for your feedback, Ali. We apologize for the delay and will improve our scheduling.'
            },
            {
                id: 3,
                guestName: 'John Doe',
                date: '05 Feb 2025',
                rating: 5.0,
                comment: 'Best day ever! The kids loved the snorkeling spots.',
                reply: null
            },
            {
                id: 4,
                guestName: 'Emily Chen',
                date: '01 Feb 2025',
                rating: 4.0,
                comment: 'Good value for money. The lunch provided was delicious.',
                reply: null
            }
        ]
    };

    return (
        <>
            <ActivityNavbar
                activityName={activityData.name}
                activityId={activityData.id}
                activityImage={activityData.image}
            />
            <div className="activity-dashboard-container">
                <div className="dashboard-title-section">
                    <h1>Guest Reviews</h1>
                    <p>See what your guests are saying about their experience.</p>
                </div>

                <div className="dashboard-overview-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 350px' }}>
                    {/* Main Column: Reviews List */}
                    <div className="main-col">
                        <div className="reviews-list-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                All Reviews
                                <select style={{ fontSize: '0.9rem', padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                                    <option>Most Recent</option>
                                    <option>Highest Rated</option>
                                    <option>Lowest Rated</option>
                                </select>
                            </h2>

                            <div className="reviews-stream">
                                {reviewsData.reviews.map((review) => (
                                    <div key={review.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '24px', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {review.guestName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#333' }}>{review.guestName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{review.date}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', height: 'fit-content' }}>
                                                <span style={{ fontWeight: '700', color: '#333' }}>{review.rating}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#666' }}>/ 5</span>
                                            </div>
                                        </div>
                                        <p style={{ color: '#4b5563', lineHeight: '1.5', marginTop: '12px' }}>
                                            "{review.comment}"
                                        </p>

                                        {/* Reply Section */}
                                        {review.reply && (
                                            <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', marginTop: '16px', marginLeft: '20px', borderLeft: '3px solid #5392f9' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#5392f9', marginBottom: '4px' }}>Your Reply:</div>
                                                <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>{review.reply}</p>
                                            </div>
                                        )}
                                        {!review.reply && (
                                            <div style={{ marginTop: '12px' }}>
                                                <button style={{ background: 'none', border: 'none', color: '#5392f9', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', padding: 0 }}>
                                                    <i className="fas fa-reply"></i> Reply to review
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Side Column: Score Overview */}
                    <div className="side-col">
                        <div className="score-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>Review Score</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#5392f9' }}>{reviewsData.averageScore}</span>
                                <span style={{ color: '#666' }}>out of 5</span>
                            </div>

                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '24px' }}>
                                Based on <strong>{reviewsData.totalReviews} reviews</strong>
                            </div>

                            <div className="score-breakdown">
                                {reviewsData.breakdown.map((item, index) => (
                                    <div key={index} style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem' }}>
                                            <span>{item.label}</span>
                                            <span style={{ fontWeight: '600' }}>{item.score}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(item.score / 5) * 100}%`, height: '100%', background: '#5392f9', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Last Review Highlight */}
                        <div className="last-review-card" style={{ background: '#ebf8ff', borderRadius: '12px', padding: '20px', marginTop: '24px', border: '1px solid #bee3f8' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2c5282', marginBottom: '12px' }}>
                                <i className="fas fa-bullhorn" style={{ marginRight: '8px' }}></i> Newest Review
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#2a4365', fontStyle: 'italic', marginBottom: '12px' }}>
                                "{reviewsData.reviews[0].comment}"
                            </p>
                            <div style={{ fontSize: '0.85rem', color: '#4a5568', textAlign: 'right' }}>
                                - {reviewsData.reviews[0].guestName} ({reviewsData.reviews[0].date})
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerGuestReviews;
