import React, { useState } from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerPayoutSettings = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    const [bankDetails, setBankDetails] = useState({
        accountHolder: 'John Doe',
        bankName: 'Maybank',
        accountNumber: '1234567890',
        swiftCode: 'MBBEMYKL',
        currency: 'MYR'
    });

    const [taxDetails, setTaxDetails] = useState({
        taxId: 'IG123456789',
        registeredName: 'John Doe Enterprise',
        address: '123 Jalan Ampang, Kuala Lumpur',
    });

    const [isEditingBank, setIsEditingBank] = useState(false);
    const [isEditingTax, setIsEditingTax] = useState(false);

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankDetails({ ...bankDetails, [name]: value });
    };

    const handleTaxChange = (e) => {
        const { name, value } = e.target;
        setTaxDetails({ ...taxDetails, [name]: value });
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Payout & Tax Settings</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Manage your banking information and tax details.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '30px', alignItems: 'start' }}>

                    {/* Bank Details Section */}
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #edf2f7', paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                                <i className="fas fa-university" style={{ marginRight: '10px', color: '#3182ce' }}></i>
                                Bank Account
                            </h2>
                            <button
                                className="btn-primary"
                                onClick={() => setIsEditingBank(!isEditingBank)}
                                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                            >
                                {isEditingBank ? 'Save' : 'Edit'}
                            </button>
                        </div>

                        {isEditingBank ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Account Holder Name</label>
                                    <input type="text" name="accountHolder" value={bankDetails.accountHolder} onChange={handleBankChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Bank Name</label>
                                    <input type="text" name="bankName" value={bankDetails.bankName} onChange={handleBankChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Account Number</label>
                                    <input type="text" name="accountNumber" value={bankDetails.accountNumber} onChange={handleBankChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>SWIFT / BIC Code</label>
                                    <input type="text" name="swiftCode" value={bankDetails.swiftCode} onChange={handleBankChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Account Holder</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{bankDetails.accountHolder}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Bank Name</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{bankDetails.bankName}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Account Number</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>•••• {bankDetails.accountNumber.slice(-4)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Currency</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{bankDetails.currency}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tax Information Section */}
                    <div className="card-simple" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #edf2f7', paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                                <i className="fas fa-file-invoice-dollar" style={{ marginRight: '10px', color: '#e53e3e' }}></i>
                                Tax Information
                            </h2>
                            <button
                                className="btn-secondary"
                                onClick={() => setIsEditingTax(!isEditingTax)}
                                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                            >
                                {isEditingTax ? 'Save' : 'Edit'}
                            </button>
                        </div>

                        {isEditingTax ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Registered Business Name</label>
                                    <input type="text" name="registeredName" value={taxDetails.registeredName} onChange={handleTaxChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Tax ID / SST Number</label>
                                    <input type="text" name="taxId" value={taxDetails.taxId} onChange={handleTaxChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Registered Address</label>
                                    <textarea name="address" value={taxDetails.address} onChange={handleTaxChange} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontFamily: 'inherit' }} />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Business Name</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{taxDetails.registeredName}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Tax ID</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{taxDetails.taxId}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#718096', fontSize: '0.95rem' }}>Address</span>
                                    <span style={{ fontWeight: '600', color: '#2d3748', textAlign: 'right', maxWidth: '60%' }}>{taxDetails.address}</span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default PartnerPayoutSettings;
