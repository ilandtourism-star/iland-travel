import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, Package, CheckCircle, Clock, XCircle, ArrowRight, Ticket } from 'lucide-react';

const STATUS_CONFIG = {
    confirmed: { label: 'Confirmed', icon: CheckCircle, color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
    pending: { label: 'Pending', icon: Clock, color: '#d97706', bg: '#fef3c7', border: '#fcd34d' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
};

const BookingCard = ({ booking, onViewInvoice }) => {
    const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed;
    const StatusIcon = status.icon;

    const formattedDate = booking.date
        ? new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Date not set';

    return (
        <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.2s, transform 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(83,146,249,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #5392f9, #3b6fd4)', borderRadius: '10px', padding: '8px', display: 'flex' }}>
                        <Package size={18} color="#fff" />
                    </div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b', lineHeight: 1.3 }}>
                            {booking.packageName || 'Unknown Package'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                            ID: <span style={{ fontFamily: 'monospace', color: '#64748b', fontWeight: '600' }}>{booking.id}</span>
                        </div>
                    </div>
                </div>
                {/* Status Badge */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: status.bg, color: status.color,
                    border: `1px solid ${status.border}`,
                    borderRadius: '999px', padding: '4px 12px',
                    fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap',
                }}>
                    <StatusIcon size={12} />
                    {status.label}
                </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                    <Calendar size={15} color="#5392f9" />
                    <span>{formattedDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                    <Users size={15} color="#5392f9" />
                    <span>{booking.adults || booking.pax} Adults{booking.children > 0 ? `, ${booking.children} Children` : ''}</span>
                </div>
            </div>

            {/* Price + Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Amount</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
                        RM {booking.totalPrice}
                    </div>
                </div>
                <button
                    onClick={() => onViewInvoice(booking.id)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'linear-gradient(135deg, #5392f9, #3b6fd4)',
                        color: '#fff', border: 'none', borderRadius: '10px',
                        padding: '10px 18px', fontWeight: '600', fontSize: '13px',
                        cursor: 'pointer', transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <Ticket size={14} />
                    View Receipt
                    <ArrowRight size={13} />
                </button>
            </div>
        </div>
    );
};

import { secureFetch } from '../lib/api';

const bookingReducer = (state, action) => {
    switch (action.type) {
        case 'SEARCH_INIT':
            return {
                ...state,
                loading: true,
                error: '',
                results: null,
            };
        case 'SEARCH_SUCCESS':
            return {
                ...state,
                loading: false,
                error: '',
                results: action.payload,
            };
        case 'SEARCH_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                results: null,
            };
        case 'RESET_SEARCH':
            return {
                ...state,
                loading: false,
                error: '',
                results: null,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const MyBookings = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('id'); // 'id' or 'email'

    const [state, dispatch] = React.useReducer(bookingReducer, {
        results: null,
        loading: false,
        error: '',
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        dispatch({ type: 'SEARCH_INIT' });

        try {
            const param = searchType === 'id' ? `id=${encodeURIComponent(query.trim())}` : `email=${encodeURIComponent(query.trim())}`;
            const res = await secureFetch(`/api/v1/booking/lookup?${param}`);
            const data = await res.json();

            if (data.success) {
                dispatch({ type: 'SEARCH_SUCCESS', payload: data.bookings });
            } else {
                dispatch({ type: 'SEARCH_FAILURE', payload: data.message || 'No bookings found.' });
            }
        } catch (err) {
            dispatch({ type: 'SEARCH_FAILURE', payload: 'Network error. Please ensure the server is running.' });
        }
    };

    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f6ff 0%, #f8faff 100%)', paddingBottom: '60px' }}>
            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #5392f9 100%)',
                padding: '60px 24px 80px',
                textAlign: 'center',
                color: '#fff',
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                    Check Booking Status
                </h1>
                <p style={{ margin: 0, opacity: 0.85, fontSize: '15px' }}>
                    Enter your Booking ID or email to view your booking status.
                </p>
            </div>

            {/* Search Card */}
            <div style={{ maxWidth: '600px', margin: '-40px auto 0', padding: '0 20px' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    boxShadow: '0 8px 40px rgba(83,146,249,0.15)',
                    padding: '32px',
                }}>
                    {/* Toggle */}
                    <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
                        {[
                            { value: 'id', label: '🔖 Booking ID' },
                            { value: 'email', label: '✉️ Email' }
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => { setSearchType(opt.value); dispatch({ type: 'RESET_SEARCH' }); }}
                                style={{
                                    flex: 1, padding: '10px', border: 'none', borderRadius: '9px',
                                    fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                                    background: searchType === opt.value ? '#fff' : 'transparent',
                                    color: searchType === opt.value ? '#1e40af' : '#64748b',
                                    boxShadow: searchType === opt.value ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type={searchType === 'email' ? 'email' : 'text'}
                                placeholder={searchType === 'id' ? 'Example: k5dnhb5vi' : 'Example: email@example.com'}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px 12px 40px',
                                    border: '2px solid #e2e8f0', borderRadius: '12px',
                                    fontSize: '14px', outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = '#5392f9'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={state.loading}
                            style={{
                                background: state.loading ? '#94a3b8' : 'linear-gradient(135deg, #5392f9, #3b6fd4)',
                                color: '#fff', border: 'none', borderRadius: '12px',
                                padding: '12px 22px', fontWeight: '700', fontSize: '14px',
                                cursor: state.loading ? 'not-allowed' : 'pointer',
                                whiteSpace: 'nowrap', transition: 'opacity 0.2s',
                            }}
                        >
                            {state.loading ? '...' : 'SEARCH'}
                        </button>
                    </form>

                    {state.error && (
                        <div style={{
                            marginTop: '16px', padding: '12px 16px', borderRadius: '10px',
                            background: '#fef2f2', border: '1px solid #fecaca',
                            color: '#dc2626', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <XCircle size={15} />
                            {state.error}
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            {state.results && (
                <div style={{ maxWidth: '700px', margin: '32px auto 0', padding: '0 20px' }}>
                    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                        {state.results.length} bookings found
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {state.results.map(booking => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onViewInvoice={(id) => navigate(`/invoice/${id}`)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
};

export default MyBookings;
