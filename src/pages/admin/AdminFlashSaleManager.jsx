import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { ArrowLeft, Zap, Save, RefreshCw, AlertCircle } from 'lucide-react';

const AdminFlashSaleManager = () => {
    const { success, error } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Default settings if nothing in localStorage
    const defaultSettings = [
        { id: 1, title: "Snorkeling in Kapas Island", isFlashSale: true, price: "49.00", originalPrice: "89.00", hours: 2.5, seatsLeft: 3 },
        { id: 2, title: "Snorkeling in Redang Island", isFlashSale: true, price: "100.00", originalPrice: "160.00", hours: 4.2, seatsLeft: 5 },
        { id: 3, title: "Snorkeling in Perhentian Island", isFlashSale: true, price: "80.00", originalPrice: "135.00", hours: 1.8, seatsLeft: 2 },
    ];

    const [flashSales, setFlashSales] = useState([]);

    useEffect(() => {
        // Fetch from localStorage or use defaults
        const saved = localStorage.getItem('iland_flash_sales');
        if (saved) {
            setFlashSales(JSON.parse(saved));
        } else {
            setFlashSales(defaultSettings);
        }
        setIsLoading(false);
    }, []);

    const toggleFlashSale = (id) => {
        setFlashSales(prev => prev.map(item =>
            item.id === id ? { ...item, isFlashSale: !item.isFlashSale } : item
        ));
    };

    const handleUpdate = (id, field, value) => {
        setFlashSales(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSave = () => {
        setIsSaving(true);
        try {
            localStorage.setItem('iland_flash_sales', JSON.stringify(flashSales));
            // Trigger storage event for Home.jsx to react
            window.dispatchEvent(new Event('storage'));

            setTimeout(() => {
                success('Tetapan Flash Sale berjaya disimpan!');
                setIsSaving(false);
            }, 800);
        } catch (err) {
            error('Gagal menyimpan tetapan.');
            setIsSaving(false);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    style={{ background: '#f3f4f6', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', color: '#4b5563' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Pengurusan Flash Sale</h1>
                    <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Aktifkan atau matikan tawaran kilat serta ubah suai harga dan stok.</p>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Memuatkan data...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {flashSales.map((item) => (
                        <div key={item.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            border: '1px solid #e5e7eb',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            alignItems: 'center',
                            gap: '24px',
                            boxShadow: item.isFlashSale ? '0 4px 12px rgba(239, 68, 68, 0.05)' : 'none',
                            borderColor: item.isFlashSale ? '#fecaca' : '#e5e7eb'
                        }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{
                                    width: '48px', height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: item.isFlashSale ? '#fee2e2' : '#f3f4f6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: item.isFlashSale ? '#ef4444' : '#9ca3af'
                                }}>
                                    <Zap size={24} fill={item.isFlashSale ? "currentColor" : "none"} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{item.title}</h3>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Harga Sale (RM)</label>
                                            <input
                                                type="text"
                                                value={item.price}
                                                onChange={(e) => handleUpdate(item.id, 'price', e.target.value)}
                                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '80px', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Harga Asal (RM)</label>
                                            <input
                                                type="text"
                                                value={item.originalPrice}
                                                onChange={(e) => handleUpdate(item.id, 'originalPrice', e.target.value)}
                                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '80px', fontSize: '14px', color: '#9ca3af' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Tempoh (Jam)</label>
                                            <input
                                                type="number"
                                                value={item.hours}
                                                onChange={(e) => handleUpdate(item.id, 'hours', parseFloat(e.target.value))}
                                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '60px', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Baki Stok</label>
                                            <input
                                                type="number"
                                                value={item.seatsLeft}
                                                onChange={(e) => handleUpdate(item.id, 'seatsLeft', parseInt(e.target.value))}
                                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '60px', fontSize: '14px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: item.isFlashSale ? '#ef4444' : '#64748b' }}>
                                        {item.isFlashSale ? 'AKTIF' : 'MATI'}
                                    </span>
                                    <div
                                        onClick={() => toggleFlashSale(item.id)}
                                        style={{
                                            width: '52px', height: '28px',
                                            backgroundColor: item.isFlashSale ? '#ef4444' : '#e5e7eb',
                                            borderRadius: '20px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px', height: '20px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '4px',
                                            left: item.isFlashSale ? '28px' : '4px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={16} />
                            Klik simpan untuk mengemas kini laman utama secara langsung.
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#111827',
                                color: 'white',
                                padding: '12px 32px',
                                borderRadius: '12px',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: isSaving ? 0.7 : 1
                            }}
                        >
                            {isSaving ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                            {isSaving ? 'Menyimpan...' : 'Simpan Semua Tetapan'}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminFlashSaleManager;
