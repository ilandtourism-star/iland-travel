import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { secureFetch } from '../../lib/api';
import { Calendar, Save, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

const AdminMonsoonManager = () => {
    const { success, error } = useToast();
    const navigate = useNavigate();
    const [monsoonMonths, setMonsoonMonths] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const fetchMonsoonMonths = async () => {
            try {
                const response = await secureFetch('/api/v1/settings/monsoon_months');
                const data = await response.json();
                if (data.success) {
                    setMonsoonMonths(data.value || []);
                } else {
                    error('Gagal mengambil data monsun.');
                }
            } catch (err) {
                error('Ralat pelayan.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMonsoonMonths();
    }, []);

    const toggleMonth = (index) => {
        if (monsoonMonths.includes(index)) {
            setMonsoonMonths(monsoonMonths.filter(m => m !== index));
        } else {
            setMonsoonMonths([...monsoonMonths, index].sort((a, b) => a - b));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await secureFetch('/api/v1/settings/monsoon_months', {
                method: 'PUT',
                body: JSON.stringify({ value: monsoonMonths }),
                credentials: 'include'
            });

            if (response.ok) {
                success('Tetapan monsun berjaya disimpan!');
            } else {
                error('Gagal menyimpan tetapan.');
            }
        } catch (err) {
            error('Ralat pelayan.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    style={{ background: '#f3f4f6', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', color: '#4b5563' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Pengurusan Musim Monsun</h1>
                    <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Tentukan bulan yang akan disekat dalam kalendar tempahan.</p>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Memuatkan data...</div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '32px', border: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        {allMonths.map((month, index) => {
                            const isBlocked = monsoonMonths.includes(index);
                            return (
                                <div
                                    key={month}
                                    onClick={() => toggleMonth(index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: `2px solid ${isBlocked ? '#fee2e2' : '#f3f4f6'}`,
                                        backgroundColor: isBlocked ? '#fff5f5' : 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {isBlocked ? (
                                        <XCircle size={20} color="#e53e3e" />
                                    ) : (
                                        <CheckCircle2 size={20} color="#10b981" />
                                    )}
                                    <span style={{ fontWeight: 500, color: isBlocked ? '#c53030' : '#374151' }}>{month}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '10px',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                opacity: isSaving ? 0.7 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Save size={20} />
                            {isSaving ? 'Menyimpan...' : 'Simpan Tetapan Monsun'}
                        </button>
                    </div>
                </div>
            )}

            {/* Notification Info */}
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe', display: 'flex', gap: '12px' }}>
                <Calendar size={20} color="#2563eb" />
                <p style={{ margin: 0, fontSize: '14px', color: '#1e40af', lineHeight: 1.5 }}>
                    <strong>Nota:</strong> Bulan yang ditandakan dengan ikon merah <XCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> akan disekat sepenuhnya dalam kalendar tempahan pelanggan. Banner amaran juga akan dipaparkan secara automatik.
                </p>
            </div>
        </div>
    );
};

export default AdminMonsoonManager;
