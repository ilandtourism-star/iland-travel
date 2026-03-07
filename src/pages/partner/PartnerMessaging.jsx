import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerMessaging = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [messages] = useState([
        { id: 1, sender: 'Ahmad Albab', subject: 'Inquiry about availability', preview: 'Hi, I would like to know if there are slots for next Saturday...', date: '10:30 AM', read: false },
        { id: 2, sender: 'Sarah Tan', subject: 'Booking Cancellation', preview: 'I need to cancel my booking for tomorrow due to emergency...', date: 'Yesterday', read: true },
        { id: 3, sender: 'John Smith', subject: 'Special Request', preview: 'Can we bring our own snorkeling gear?', date: 'Oct 23', read: true },
    ]);

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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Messages</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Communicate with your guests and potential customers.</p>
                    </div>
                </div>

                <div className="card-simple" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #edf2f7', background: '#f7fafc', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button style={{ fontWeight: '600', color: '#3182ce', borderBottom: '2px solid #3182ce', paddingBottom: '14px', marginBottom: '-17px' }}>Inbox</button>
                            <button style={{ fontWeight: '500', color: '#718096', paddingBottom: '14px', marginBottom: '-17px' }}>Sent</button>
                            <button style={{ fontWeight: '500', color: '#718096', paddingBottom: '14px', marginBottom: '-17px' }}>Archived</button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {messages.map((msg, index) => (
                                    <tr key={msg.id} style={{
                                        borderBottom: index < messages.length - 1 ? '1px solid #edf2f7' : 'none',
                                        background: msg.read ? 'white' : '#ebf8ff',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}>
                                        <td style={{ padding: '16px 24px', width: '20%' }}>
                                            <div style={{ fontWeight: msg.read ? '500' : '700', color: '#2d3748' }}>{msg.sender}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px', width: '60%' }}>
                                            <span style={{ fontWeight: msg.read ? '500' : '700', color: '#2d3748', marginRight: '8px' }}>{msg.subject}</span>
                                            <span style={{ color: '#718096' }}>- {msg.preview}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', width: '20%', textAlign: 'right', color: '#718096', fontSize: '0.9rem' }}>
                                            {msg.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {messages.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
                            No messages found.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PartnerMessaging;
