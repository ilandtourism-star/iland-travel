import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Wallet, ShieldCheck, ChevronRight, Lock } from 'lucide-react';
import { getDisplayPackageName } from '../utils/activityLinks';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId, packageName, date, pax, totalPrice, vacation_sku } = location.state || {};
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!bookingId) {
        return (
            <div style={{ padding: '100px 20px', textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>
                <h2>No booking information found. Please try again.</h2>
                <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
            </div>
        );
    }

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment delay
        setTimeout(() => {
            setIsProcessing(false);
            navigate('/booking-success', { state: location.state });
        }, 2000);
    };

    const paymentMethods = [
        { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard size={20} />, description: 'Visa, Mastercard, AMEX' },
        { id: 'fpx', name: 'Online Banking (FPX)', icon: <Banknote size={20} />, description: 'Maybank2u, CIMB Clicks, etc.' },
        { id: 'ewallet', name: 'E-Wallet', icon: <Wallet size={20} />, description: 'Touch \'n Go, GrabPay, Boost' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f1f5f9',
            padding: '40px 20px',
            fontFamily: "'Poppins', sans-serif"
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '32px' }}>

                {/* Left Side: Payment Methods */}
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Secure Checkout</h1>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={18} color="#64748b" /> Select Payment Method
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    style={{
                                        border: `2px solid ${selectedMethod === method.id ? '#007bff' : '#e2e8f0'}`,
                                        borderRadius: '10px',
                                        padding: '16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        transition: 'all 0.2s',
                                        backgroundColor: selectedMethod === method.id ? '#f0f7ff' : 'transparent'
                                    }}
                                >
                                    <div style={{
                                        color: selectedMethod === method.id ? '#007bff' : '#64748b'
                                    }}>
                                        {method.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '15px' }}>{method.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{method.description}</div>
                                    </div>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: `2px solid ${selectedMethod === method.id ? '#007bff' : '#cbd5e0'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {selectedMethod === method.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#007bff' }} />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedMethod === 'card' && (
                            <div style={{ marginTop: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Card Number</label>
                                    <input type="text" placeholder="•••• •••• •••• ••••" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Expiry</label>
                                        <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px' }}>CVC</label>
                                        <input type="text" placeholder="123" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            opacity: isProcessing ? 0.7 : 1
                        }}
                    >
                        {isProcessing ? 'Processing Payment...' : <>Pay Now (RM {totalPrice}) <ChevronRight size={20} /></>}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', color: '#64748b', fontSize: '13px' }}>
                        <ShieldCheck size={16} color="#22c55e" /> Secure 256-bit SSL Encrypted Payment
                    </div>
                </div>

                {/* Right Side: Summary */}
                <div style={{ position: 'sticky', top: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Booking Summary</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Package</div>
                                <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{getDisplayPackageName(vacation_sku, packageName)}</div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(date).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guests</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{pax} Pax</div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>Total Amount</div>
                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>RM {totalPrice}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
