import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureFetch } from '../lib/api';

const API_BASE = '';

const PartnerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await secureFetch(`${API_BASE}/api/v1/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect berdasarkan peranan
                if (data.user?.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/partner/activity-listing');
                }
            } else {
                setError(data.message || 'Username atau password salah.');
            }
        } catch (err) {
            setError('Gagal sambung ke pelayan. Pastikan server berjalan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Inter', sans-serif", padding: '20px'
        }}>
            <div style={{
                background: 'white', borderRadius: '16px', padding: '48px 40px',
                maxWidth: '420px', width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '56px', height: '56px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '12px', display: 'inline-flex', alignItems: 'center',
                        justifyContent: 'center', marginBottom: '16px'
                    }}>
                        <i className="fas fa-anchor" style={{ color: 'white', fontSize: '24px' }}></i>
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1a202c', margin: '0 0 8px' }}>
                        ilaand Partner Portal
                    </h1>
                    <p style={{ color: '#718096', margin: 0, fontSize: '0.95rem' }}>
                        Log masuk untuk mengurus aktiviti anda
                    </p>
                </div>

                {/* Ralat */}
                {error && (
                    <div style={{
                        background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030',
                        padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
                        fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '8px', fontSize: '0.9rem' }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            required
                            style={{
                                width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0',
                                borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
                                outline: 'none', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#667eea'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '8px', fontSize: '0.9rem' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            required
                            style={{
                                width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0',
                                borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
                                outline: 'none', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#667eea'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '14px',
                            background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white', border: 'none', borderRadius: '8px',
                            fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {loading ? (
                            <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Sedang log masuk...</>
                        ) : (
                            <><i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>Log Masuk</>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: '24px', padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096' }}>
                        <i className="fas fa-shield-alt" style={{ marginRight: '6px', color: '#48bb78' }}></i>
                        Sambungan selamat dengan perlindungan CSRF
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PartnerLogin;
