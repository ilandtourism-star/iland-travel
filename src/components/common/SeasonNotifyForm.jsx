import React, { useState } from 'react';
import { secureFetch } from '../../lib/api';

/**
 * Komponen borang untuk notifikasi "In Season".
 * Digunakan apabila aktiviti berada di luar musim.
 */
const SeasonNotifyForm = ({ sku, title }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await secureFetch('/api/v1/season-listener', {
                method: 'POST',
                body: JSON.stringify({ email, sku })
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setMessage(data.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.message || 'An error occurred. Please try again.');
            }
        } catch (err) {
            console.error('Season Listener error:', err);
            setStatus('error');
            setMessage('Sorry, network error. Please try again later.');
        }
    };

    if (status === 'success') {
        return (
            <div className="notify-success" style={{
                backgroundColor: '#f0fdf4',
                color: '#166534',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                marginTop: '10px',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <i className="fas fa-check-circle"></i>
                <span>{message}</span>
            </div>
        );
    }

    return (
        <div className="season-notify-container" style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1'
        }}>
            <p style={{
                fontSize: '13px',
                color: '#475569',
                marginBottom: '10px',
                lineHeight: '1.4'
            }}>
                <i className="fas fa-calendar-times" style={{ color: '#ef4444', marginRight: '5px' }}></i>
                This activity is currently closed (Off-Season). Leave your email and we'll notify you when it reopens.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="email"
                    placeholder="Your email..."
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px'
                    }}
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background 0.2s'
                    }}
                >
                    {status === 'loading' ? '...' : 'SEND'}
                </button>
            </form>
            {status === 'error' && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{message}</p>
            )}
        </div>
    );
};

export default SeasonNotifyForm;
