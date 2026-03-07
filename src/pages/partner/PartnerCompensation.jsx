import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerCompensation = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [compensationDetails] = useState({
        commissionRate: '15%',
        paymentTerm: 'Net 30',
        currency: 'MYR',
        effectiveDate: '2023-01-01',
        contractStatus: 'Active'
    });

    const [agreementHistory] = useState([
        { date: '2023-01-01', action: 'Contract Renewed', details: 'Commission rate set to 15%' },
        { date: '2022-01-01', action: 'Initial Agreement', details: 'Commission rate set to 18%' },
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Contracted Compensation</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Overview of your commission rates and contract terms.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '30px', alignItems: 'start' }}>

                    {/* Current Agreement Section */}
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #edf2f7', paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                                <i className="fas fa-file-contract" style={{ marginRight: '10px', color: '#805ad5' }}></i>
                                Current Agreement
                            </h2>
                            <span style={{
                                padding: '4px 12px', borderRadius: '9999px',
                                fontSize: '0.8rem', fontWeight: '600',
                                background: '#c6f6d5', color: '#2f855a'
                            }}>
                                {compensationDetails.contractStatus}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>Commission Rate</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>{compensationDetails.commissionRate}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#718096', textAlign: 'right' }}>Payment Term</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', textAlign: 'right' }}>{compensationDetails.paymentTerm}</div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Currency</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{compensationDetails.currency}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Effective Date</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{compensationDetails.effectiveDate}</span>
                                </div>
                            </div>

                            <button className="btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i> Download Contract (PDF)
                            </button>
                        </div>
                    </div>

                    {/* Agreement History Section */}
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <div style={{ marginBottom: '24px', borderBottom: '1px solid #edf2f7', paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                                <i className="fas fa-history" style={{ marginRight: '10px', color: '#3182ce' }}></i>
                                Agreement History
                            </h2>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {agreementHistory.map((item, index) => (
                                <li key={index} style={{
                                    display: 'flex', gap: '16px',
                                    paddingBottom: index < agreementHistory.length - 1 ? '16px' : '0',
                                    marginBottom: index < agreementHistory.length - 1 ? '16px' : '0',
                                    borderBottom: index < agreementHistory.length - 1 ? '1px solid #edf2f7' : 'none'
                                }}>
                                    <div style={{ flex: '0 0 90px', fontSize: '0.9rem', color: '#718096', fontWeight: '500' }}>
                                        {item.date}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d3748' }}>{item.action}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#4a5568', marginTop: '2px' }}>{item.details}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PartnerCompensation;
