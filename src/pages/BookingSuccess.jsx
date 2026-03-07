import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Mail, Calendar, Package, Download } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId, packageName, date, pax, totalPrice, vacation_sku } = location.state || {};

    if (!bookingId) {
        return (
            <div style={{ padding: '100px 20px', textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>
                <h2>No booking data found.</h2>
                <button onClick={() => navigate('/')} className="btn-primary">Return to Home</button>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8fafc',
            fontFamily: "'Poppins', sans-serif"
        }}>
            <div style={{
                backgroundColor: 'white',
                maxWidth: '600px',
                width: '100%',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                textAlign: 'center',
                marginBottom: '40px'
            }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CheckCircle size={48} color="#22c55e" />
                    </div>
                </div>

                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                    Tempahan Berjaya!
                </h1>
                <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '32px' }}>
                    Terima kasih! Tempahan anda telah direkodkan. Sila semak emel anda untuk pengesahan lanjut.
                </p>

                <div style={{
                    backgroundColor: '#f1f5f9',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'left',
                    marginBottom: '32px'
                }}>
                    <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b', fontSize: '14px' }}>Booking ID</span>
                        <span style={{ fontWeight: '700', color: '#007bff' }}>#{bookingId}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Package size={18} color="#64748b" />
                        <div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Aktiviti</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: '#334155' }}>{packageName}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Calendar size={18} color="#64748b" />
                        <div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Tarikh</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: '#334155' }}>{new Date(date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Mail size={18} color="#64748b" />
                        <div style={{ fontSize: '14px', color: '#475569' }}>
                            Pengesahan dihantar ke emel anda.
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate(`/invoice/${bookingId}`)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'white',
                            color: '#1e293b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Download size={18} /> Lihat Resit
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Home size={18} /> Laman Utama
                    </button>
                </div>

                <div style={{ marginTop: '32px', color: '#94a3b8', fontSize: '13px' }}>
                    Ada soalan? Hubungi sokongan kami di <a href="mailto:support@illand.com" style={{ color: '#007bff', textDecoration: 'none' }}>support@illand.com</a>
                </div>
            </div>

            {/* Review Section */}
            <div style={{ maxWidth: '800px', width: '100%', backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                <ReviewSection vacationSku={vacation_sku} />
            </div>
        </div>
    );
};

export default BookingSuccess;
