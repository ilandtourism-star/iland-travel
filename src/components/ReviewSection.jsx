import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare } from 'lucide-react';
import { secureFetch } from '../lib/api';

const ReviewSection = ({ vacationSku }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ avgRating: 0, count: 0 });
    const [formData, setFormData] = useState({ user_name: '', rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [msg, setMsg] = useState(null);

    const fetchReviews = async () => {
        try {
            const res = await secureFetch(`/api/v1/reviews/${vacationSku}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews);
                setStats({ avgRating: data.avgRating, count: data.count });
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    useEffect(() => {
        if (vacationSku) fetchReviews();
    }, [vacationSku]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await secureFetch('/api/v1/review', {
                method: 'POST',
                body: JSON.stringify({ ...formData, vacation_sku: vacationSku })
            });
            const data = await res.json();
            if (data.success) {
                setMsg({ type: 'success', text: 'Review submitted successfully!' });
                setFormData({ user_name: '', rating: 5, comment: '' });
                fetchReviews();
            } else {
                setMsg({ type: 'error', text: data.message });
            }
        } catch (err) {
            setMsg({ type: 'error', text: 'Error submitting review.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? "#f59e0b" : "none"} color={i < rating ? "#f59e0b" : "#cbd5e1"} />
        ));
    };

    return (
        <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '40px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Customer Reviews</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <div style={{ display: 'flex' }}>{renderStars(Math.round(stats.avgRating))}</div>
                        <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                            {stats.avgRating.toFixed(1)} / 5 ({stats.count} reviews)
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                {/* Review List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reviews.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No reviews yet for this package.</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} color="#64748b" />
                                        </div>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{review.user_name}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>{renderStars(review.rating)}</div>
                                </div>
                                <p style={{ color: '#475569', fontSize: '14px', margin: '8px 0 0 0', lineHeight: '1.6' }}>
                                    {review.comment}
                                </p>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>
                                    {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Submit Form */}
                <div style={{
                    backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px',
                    height: 'fit-content', position: 'sticky', top: '20px'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={18} color="#007bff" /> Write a Review
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Your Name</label>
                            <input
                                type="text" value={formData.user_name} required
                                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Rating</label>
                            <select
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                            >
                                <option value="5">5 Stars (Excellent)</option>
                                <option value="4">4 Stars (Good)</option>
                                <option value="3">3 Stars (Average)</option>
                                <option value="2">2 Stars (Poor)</option>
                                <option value="1">1 Star (Very Poor)</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Comment</label>
                            <textarea
                                rows="3" value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'none' }}
                            ></textarea>
                        </div>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1e293b',
                                color: 'white', fontWeight: '600', cursor: 'pointer', border: 'none'
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        {msg && <div style={{ marginTop: '12px', fontSize: '13px', textAlign: 'center', color: msg.type === 'success' ? '#16a34a' : '#dc2626' }}>{msg.text}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
