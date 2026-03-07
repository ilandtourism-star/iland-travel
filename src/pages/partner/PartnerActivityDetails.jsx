import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import PartnerNavbar from '../../components/layout/PartnerNavbar';

const PartnerActivityDetails = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        location: '',
        highlights: '',
    });
    const { addToast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="partner-equipment-wrapper">
            <PartnerNavbar />


            <div className="container">
                {/* Sidebar Navigation */}
                <aside className="sidebar">
                    <div className="nav-card">
                        <div className="nav-header">Activity Information</div>
                        <div className="step active" onClick={() => navigate('/partner/activity-details')}>Details</div>
                        <div className="step" onClick={() => navigate('/partner/one-package-detail')}>Meeting Point</div>
                        <div className="step" onClick={() => navigate('/partner/departure-time')}>Departure Time</div>
                        <div className="step" onClick={() => navigate('/partner/spots')}>Spots</div>
                        <div className="step" onClick={() => navigate('/partner/equipment-service')}>Equipment & Service</div>
                        <div className="step" onClick={() => navigate('/partner/pricing')}>Pricing</div>
                        <div className="step" onClick={() => navigate('/partner/photos')}>Photos</div>
                        <div className="step" onClick={() => navigate('/partner/publish')}>Publish</div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                    <div className="content-card">
                        <h1>Activity Details</h1>
                        <p className="subtitle">
                            Please provide the general information for your activity.
                        </p>

                        <hr />

                        <div className="section-box">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="input-group">
                                    <label style={{ fontWeight: '600' }}>Activity Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Private Family Trip in Kapas Island"
                                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontWeight: '600' }}>Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="Boat Tours & Water Sports">Boat Tours & Water Sports</option>
                                        <option value="Nature & Outdoors">Nature & Outdoors</option>
                                        <option value="Classes & Workshops">Classes & Workshops</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label style={{ fontWeight: '600' }}>Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Kapas Island, Terengganu"
                                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontWeight: '600' }}>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Provide a detailed description of the activity..."
                                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontWeight: '600' }}>Highlights</label>
                                    <textarea
                                        name="highlights"
                                        value={formData.highlights}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Split highlights with commas (e.g. Snorkeling, Private Boat...)"
                                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="partner-footer-actions">
                            <button className="partner-btn-secondary" onClick={() => navigate(-1)}>Back</button>
                            <button className="partner-btn-primary" onClick={() => {
                                if (!formData.name || !formData.category || !formData.description || !formData.location || !formData.highlights) {
                                    addToast('Sila isikan semua medan yang diwajibkan sebelum meneruskan.', 'error');
                                    return;
                                }
                                navigate('/partner/one-package-detail');
                            }}>Next</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerActivityDetails;
