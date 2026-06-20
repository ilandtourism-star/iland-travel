import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CalendarDays, Users, Clock, CheckCircle2,
    LogOut, LayoutDashboard, Search, RefreshCw,
    ChevronDown, Package, TrendingUp, Zap
} from 'lucide-react';
import { secureFetch } from '../../lib/api';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    const [advAnalytics, setAdvAnalytics] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/auth');
            return;
        }
        setAdminUser(JSON.parse(userStr));
        fetchBookings();
        fetchAdvancedAnalytics();
    }, [navigate]);

    const fetchAdvancedAnalytics = async () => {
        try {
            const response = await secureFetch('/api/v1/admin/advanced-analytics', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setAdvAnalytics(data);
            }
        } catch (error) {
            console.error('Error fetching advanced analytics:', error);
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await secureFetch('/api/v1/bookings', {
                credentials: 'include'
            });
            if (response.status === 401) {
                handleLogout();
                return;
            }
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await secureFetch('/api/v1/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            localStorage.removeItem('user');
            navigate('/auth');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Stats calculation
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

    // Filter bookings
    const filteredBookings = bookings.filter(b => {
        const matchesSearch =
            (b.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (b.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (b.packageName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusStyle = (status) => {
        const base = {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-block',
        };
        switch (status) {
            case 'confirmed': return { ...base, backgroundColor: '#dcfce7', color: '#166534' };
            case 'pending': return { ...base, backgroundColor: '#fef9c3', color: '#854d0e' };
            case 'cancelled': return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
            default: return { ...base, backgroundColor: '#f3f4f6', color: '#374151' };
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('ms-MY', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        } catch { return dateStr; }
    };

    if (loading && bookings.length === 0) {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                minHeight: '100vh', backgroundColor: '#f8fafc',
                fontFamily: "'Inter', 'Poppins', sans-serif"
            }}>
                <div style={{ textAlign: 'center' }}>
                    <RefreshCw size={32} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '16px', color: '#64748b', fontSize: '14px' }}>Memuatkan Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f1f5f9',
            fontFamily: "'Inter', 'Poppins', sans-serif",
        }}>
            {/* Top Navigation Bar */}
            <nav style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '0 32px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <LayoutDashboard size={22} style={{ color: '#6366f1' }} />
                    <span style={{
                        fontSize: '18px', fontWeight: 700, color: '#1e293b',
                        letterSpacing: '-0.5px'
                    }}>
                        iland <span style={{ color: '#6366f1' }}>Admin</span>
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        backgroundColor: '#f8fafc', padding: '8px 16px',
                        borderRadius: '8px', border: '1px solid #e2e8f0',
                    }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '13px', fontWeight: 700,
                        }}>
                            {adminUser?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                                {adminUser?.username}
                            </p>
                            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                                {adminUser?.role}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            backgroundColor: 'transparent', border: '1px solid #fecaca',
                            color: '#dc2626', padding: '8px 16px', borderRadius: '8px',
                            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.target.style.backgroundColor = '#fef2f2'; }}
                        onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}
                    >
                        <LogOut size={16} /> Log Keluar
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Page Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: 0,
                        letterSpacing: '-0.5px'
                    }}>
                        Dashboard
                    </h1>
                    <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                        Ringkasan tempahan dan statistik terkini.
                    </p>
                </div>

                {/* Quick Actions */}
                <div style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/admin/capacity')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#6366f1', color: 'white', padding: '12px 20px',
                            borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgb(99 102 241 / 0.2)'
                        }}
                    >
                        <Users size={18} /> Urus Kapasiti (Max Pax)
                    </button>


                    <button
                        onClick={() => navigate('/admin/flash-sale')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#ef4444', color: 'white', padding: '12px 20px',
                            borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgb(239 68 68 / 0.2)'
                        }}
                    >
                        <Zap size={18} fill="currentColor" /> Urus Flash Sale
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                }}>
                    {/* Total Bookings Card */}
                    <div style={{
                        backgroundColor: '#ffffff', borderRadius: '16px',
                        padding: '24px', border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500 }}>
                                    Jumlah Tempahan
                                </p>
                                <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', margin: '8px 0 0' }}>
                                    {totalBookings}
                                </h2>
                            </div>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Package size={22} style={{ color: '#7c3aed' }} />
                            </div>
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div style={{
                        backgroundColor: '#ffffff', borderRadius: '16px',
                        padding: '24px', border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500 }}>
                                    Menunggu Kelulusan
                                </p>
                                <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#854d0e', margin: '8px 0 0' }}>
                                    {pendingBookings}
                                </h2>
                            </div>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #fef9c3, #fde68a)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Clock size={22} style={{ color: '#a16207' }} />
                            </div>
                        </div>
                    </div>

                    {/* Confirmed Card */}
                    <div style={{
                        backgroundColor: '#ffffff', borderRadius: '16px',
                        padding: '24px', border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500 }}>
                                    Disahkan
                                </p>
                                <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#166534', margin: '8px 0 0' }}>
                                    {confirmedBookings}
                                </h2>
                            </div>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <CheckCircle2 size={22} style={{ color: '#16a34a' }} />
                            </div>
                        </div>
                    </div>

                    {/* Customers Card */}
                    <div style={{
                        backgroundColor: '#ffffff', borderRadius: '16px',
                        padding: '24px', border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500 }}>
                                    Pelanggan
                                </p>
                                <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0369a1', margin: '8px 0 0' }}>
                                    {new Set(bookings.map(b => b.email)).size}
                                </h2>
                            </div>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Users size={22} style={{ color: '#0284c7' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Analytics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>

                    {/* Revenue by Island */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={18} color="#6366f1" /> Pendapatan Mengikut Pulau
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {advAnalytics?.islandStats.map(stat => {
                                const total = advAnalytics.islandStats.reduce((acc, curr) => acc + curr.totalRevenue, 0);
                                const percent = ((stat.totalRevenue / total) * 100).toFixed(0);
                                return (
                                    <div key={stat.island}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                                            <span style={{ fontWeight: 600, color: '#475569' }}>Pulau {stat.island}</span>
                                            <span style={{ color: '#1e293b', fontWeight: 700 }}>RM {stat.totalRevenue.toLocaleString()} ({percent}%)</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${percent}%`, height: '100%',
                                                backgroundColor: stat.island === 'Kapas' ? '#6366f1' : stat.island === 'Redang' ? '#10b981' : '#f59e0b',
                                                borderRadius: '4px'
                                            }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Partners Leaderboard */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Users size={18} color="#6366f1" /> Top Partners (Leaderboard)
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '8px', color: '#64748b' }}>Partner</th>
                                        <th style={{ padding: '8px', color: '#64748b', textAlign: 'right' }}>Tempahan</th>
                                        <th style={{ padding: '8px', color: '#64748b', textAlign: 'right' }}>Gross (RM)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {advAnalytics?.partnerLeaderboard.map(p => (
                                        <tr key={p.partnerName} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '12px 8px', fontWeight: 600, color: '#1e293b' }}>{p.partnerName}</td>
                                            <td style={{ padding: '12px 8px', textAlign: 'right', color: '#475569' }}>{p.totalBookings}</td>
                                            <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{p.totalGross.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Bookings Table Section */}
                <div style={{
                    backgroundColor: '#ffffff', borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    {/* Table Header */}
                    <div style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CalendarDays size={18} style={{ color: '#6366f1' }} />
                            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                                Senarai Tempahan
                            </h2>
                            <span style={{
                                backgroundColor: '#ede9fe', color: '#6366f1',
                                padding: '2px 10px', borderRadius: '12px',
                                fontSize: '12px', fontWeight: 600,
                            }}>
                                {filteredBookings.length}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {/* Search */}
                            <div style={{
                                position: 'relative', display: 'flex', alignItems: 'center',
                            }}>
                                <Search size={16} style={{
                                    position: 'absolute', left: '12px', color: '#94a3b8',
                                }} />
                                <input
                                    type="text"
                                    placeholder="Cari tempahan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        padding: '8px 12px 8px 36px',
                                        border: '1px solid #e2e8f0', borderRadius: '8px',
                                        fontSize: '13px', outline: 'none', width: '200px',
                                        transition: 'border-color 0.2s',
                                        backgroundColor: '#f8fafc',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>

                            {/* Filter */}
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    style={{
                                        padding: '8px 32px 8px 12px',
                                        border: '1px solid #e2e8f0', borderRadius: '8px',
                                        fontSize: '13px', outline: 'none',
                                        appearance: 'none', backgroundColor: '#f8fafc',
                                        cursor: 'pointer', color: '#334155',
                                    }}
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <ChevronDown size={14} style={{
                                    position: 'absolute', right: '10px', top: '50%',
                                    transform: 'translateY(-50%)', color: '#94a3b8',
                                    pointerEvents: 'none',
                                }} />
                            </div>

                            {/* Refresh */}
                            <button
                                onClick={fetchBookings}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '36px', height: '36px',
                                    border: '1px solid #e2e8f0', borderRadius: '8px',
                                    backgroundColor: '#f8fafc', cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ede9fe'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                title="Muat semula"
                            >
                                <RefreshCw size={14} style={{ color: '#6366f1' }} />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%', borderCollapse: 'collapse',
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                    {['ID', 'Pelanggan', 'Pakej', 'Tarikh', 'Pax', 'Status'].map(h => (
                                        <th key={h} style={{
                                            padding: '12px 24px', textAlign: 'left',
                                            fontSize: '11px', fontWeight: 600, color: '#64748b',
                                            textTransform: 'uppercase', letterSpacing: '0.5px',
                                            borderBottom: '1px solid #f1f5f9',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking, index) => (
                                        <tr
                                            key={booking.id}
                                            style={{
                                                borderBottom: '1px solid #f1f5f9',
                                                transition: 'background-color 0.15s ease',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{
                                                padding: '16px 24px', fontSize: '12px',
                                                color: '#94a3b8', fontFamily: 'monospace',
                                            }}>
                                                {booking.id?.substring(0, 8)}...
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                                                    {booking.firstName}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                                                    {booking.email}
                                                </div>
                                            </td>
                                            <td style={{
                                                padding: '16px 24px', fontSize: '13px',
                                                color: '#334155', fontWeight: 500,
                                            }}>
                                                {booking.packageName}
                                            </td>
                                            <td style={{
                                                padding: '16px 24px', fontSize: '13px',
                                                color: '#64748b',
                                            }}>
                                                {formatDate(booking.date)}
                                            </td>
                                            <td style={{
                                                padding: '16px 24px',
                                            }}>
                                                <div style={{
                                                    display: 'inline-flex', alignItems: 'center',
                                                    gap: '4px', backgroundColor: '#f1f5f9',
                                                    padding: '4px 10px', borderRadius: '6px',
                                                    fontSize: '13px', fontWeight: 600, color: '#475569',
                                                }}>
                                                    <Users size={12} />
                                                    {booking.pax}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={getStatusStyle(booking.status)}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{
                                            padding: '48px 24px', textAlign: 'center',
                                            color: '#94a3b8', fontSize: '14px',
                                        }}>
                                            <Package size={40} style={{ color: '#e2e8f0', marginBottom: '12px' }} />
                                            <p style={{ margin: 0 }}>Tiada tempahan dijumpai.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div style={{
                        padding: '14px 24px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        backgroundColor: '#fafbfc',
                    }}>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                            Memaparkan {filteredBookings.length} daripada {totalBookings} tempahan
                        </p>
                        <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>
                            ilaand Admin v1.0
                        </p>
                    </div>
                </div>
            </div>

            {/* CSS Animation for spinner */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            `}</style>
        </div>
    );
};

export default AdminDashboard;
