import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerUserManagement = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [users] = useState([
        { id: 1, name: 'Ali Bin Abu', email: 'ali@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-10-25 09:30 AM' },
        { id: 2, name: 'Siti Sarah', email: 'siti@example.com', role: 'Editor', status: 'Active', lastLogin: '2023-10-24 02:15 PM' },
        { id: 3, name: 'John Doe', email: 'john@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2023-09-15 11:00 AM' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return '#48bb78';
            case 'Inactive': return '#718096';
            default: return '#a0aec0';
        }
    };

    return (
        <>
            <ActivityNavbar
                activityName={activityData.name}
                activityId={activityData.id}
                activityImage={activityData.image}
            />
            <div className="activity-dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>User Management</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Manage access and roles for your team members.</p>
                    </div>
                    <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                        <i className="fas fa-user-plus" style={{ marginRight: '8px' }}></i> Invite User
                    </button>
                </div>

                <div className="card-simple" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Login</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id} style={{ borderBottom: index < users.length - 1 ? '1px solid #edf2f7' : 'none', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#2d3748', fontWeight: '500' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096', fontWeight: '600', fontSize: '0.8rem' }}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                {user.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#4a5568' }}>{user.email}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: '#4a5568' }}>{user.role}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px', borderRadius: '9999px',
                                                fontSize: '0.8rem', fontWeight: '600',
                                                background: `${getStatusColor(user.status)}20`, color: getStatusColor(user.status)
                                            }}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#718096' }}>{user.lastLogin}</td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerUserManagement;
