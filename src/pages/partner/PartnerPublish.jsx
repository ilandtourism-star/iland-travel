import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import PartnerNavbar from '../../components/layout/PartnerNavbar';

const PartnerPublish = () => {
    const navigate = useNavigate();

    const { success } = useToast();

    const handlePublish = () => {
        // Validation: Verify if summary information is present (mock check)
        console.log('Final check before publishing...');
        success('Congratulations! Your activity has been submitted for review.', 5000);
        console.log('Activity published successfully.');
        setTimeout(() => {
            navigate('/partner/activity-listing'); // Navigate back to the activities list or dashboard
        }, 2000);
    };

    return (
        <div className="partner-equipment-wrapper">
            <PartnerNavbar />


            <div className="container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="nav-card">
                        <div className="nav-header">Activity Information</div>
                        <div className="step done" onClick={() => navigate('/partner/activity-details')}>Details</div>
                        <div className="step done" onClick={() => navigate('/partner/one-package-detail')}>Meeting Point</div>
                        <div className="step done" onClick={() => navigate('/partner/departure-time')}>Departure Time</div>
                        <div className="step done" onClick={() => navigate('/partner/spots')}>Spots</div>
                        <div className="step done" onClick={() => navigate('/partner/equipment-service')}>Equipment & Service</div>
                        <div className="step done" onClick={() => navigate('/partner/pricing')}>Pricing</div>
                        <div className="step done" onClick={() => navigate('/partner/photos')}>Photos</div>
                        <div className="step active" onClick={() => navigate('/partner/publish')}>Publish</div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <div className="content-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ marginBottom: '30px' }}>
                            <i className="fas fa-check-circle" style={{ fontSize: '5rem', color: '#2ecc71' }}></i>
                        </div>
                        <h1>You're almost there!</h1>
                        <p className="subtitle" style={{ maxWidth: '600px', margin: '15px auto 40px' }}>
                            Please review all the information you've provided. Once you click "Publish", our team will review your listing, and it will be live on our platform within 24-48 hours.
                        </p>

                        <div style={{
                            backgroundColor: '#f9f9f9',
                            borderRadius: '12px',
                            padding: '30px',
                            textAlign: 'left',
                            maxWidth: '600px',
                            margin: '0 auto 40px',
                            border: '1px solid #eee'
                        }}>
                            <h3 style={{ marginBottom: '20px' }}>Listing Summary</h3>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666' }}>Activity Type:</span>
                                    <span style={{ fontWeight: '600' }}>Snorkeling Trip</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666' }}>Status:</span>
                                    <span style={{ color: '#5392f9', fontWeight: '600' }}>Ready to Publish</span>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                                <p style={{ fontSize: '0.9rem', color: '#777' }}>
                                    By clicking "Publish", you agree to our Partner Terms of Service and clarify that all information provided is accurate.
                                </p>
                            </div>
                        </div>

                        <button
                            className="btn btn-next"
                            style={{
                                padding: '15px 60px',
                                fontSize: '1.1rem',
                                height: 'auto',
                                width: 'auto'
                            }}
                            onClick={handlePublish}
                        >
                            Publish My Activity
                        </button>
                    </div>

                    {/* Footer Nav */}
                    <div className="partner-footer-actions">
                        <button className="partner-btn-secondary" onClick={() => navigate(-1)}>Back</button>
                        <button className="partner-btn-primary" onClick={handlePublish}>Publish</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerPublish;
