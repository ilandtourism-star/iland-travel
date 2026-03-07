import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Save, ArrowLeft, RefreshCw, Search } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import { secureFetch } from '../../lib/api';

const AdminCapacityManager = () => {
    const [vacations, setVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { success, error } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchVacations();
    }, []);

    const fetchVacations = async () => {
        setLoading(true);
        try {
            const response = await secureFetch('/api/v1/vacations');
            const data = await response.json();
            setVacations(data);
        } catch (err) {
            error('Gagal mengambil data aktiviti');
        } finally {
            setLoading(false);
        }
    };

    const handleCapacityChange = (sku, value) => {
        setVacations(vacations.map(v =>
            v.sku === sku ? { ...v, max_pax: value } : v
        ));
    };

    const saveCapacity = async (sku, newCapacity) => {
        try {
            const response = await secureFetch(`/api/v1/vacation/${sku}/capacity`, {
                method: 'PUT',
                body: JSON.stringify({ max_pax: parseInt(newCapacity) }),
                credentials: 'include'
            });

            if (response.ok) {
                success('Kapasiti berjaya dikemaskini!');
            } else {
                error('Gagal mengemaskini kapasiti');
            }
        } catch (err) {
            error('Ralat pelayan');
        }
    };

    const filteredVacations = vacations.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#6366f1', cursor: 'pointer', marginBottom: '24px', fontWeight: 600 }}
                >
                    <ArrowLeft size={18} /> Kembali ke Dashboard
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Pengurusan Kapasiti</h1>
                        <p style={{ color: '#64748b', marginTop: '4px' }}>Ubah had maksimum penumpang (max_pax) untuk setiap aktiviti.</p>
                    </div>
                    <button onClick={fetchVacations} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', backgroundColor: 'white' }}>
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Search size={18} style={{ color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Cari aktiviti..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
                        />
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>AKTIVITI</th>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>SKU</th>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>KAPASITI (MAX PAX)</th>
                                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>TINDAKAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Memuatkan...</td></tr>
                            ) : (
                                filteredVacations.map(v => (
                                    <tr key={v.sku} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 500 }}>{v.name}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>{v.sku}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Users size={16} style={{ color: '#64748b' }} />
                                                <input
                                                    type="number"
                                                    value={v.max_pax || 12}
                                                    onChange={(e) => handleCapacityChange(v.sku, e.target.value)}
                                                    style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <button
                                                onClick={() => saveCapacity(v.sku, v.max_pax || 12)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                            >
                                                <Save size={14} /> Simpan
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCapacityManager;
