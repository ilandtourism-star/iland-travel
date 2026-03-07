import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PartnerSnorkeling = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('1_package');

    const activityTypes = [
        {
            id: '1_package',
            title: '1 Package',
            description: 'Register one main snorkeling package for your business.',
            icon: <i className="fas fa-box"></i>,
        },
        {
            id: 'multiple_packages',
            title: 'Multiple Packages',
            description: 'Register more than two packages (suitable for large operations).',
            icon: <i className="fas fa-boxes"></i>,
        },
    ];

    return (
        <div className="partner-selection-wrapper">

            <div className="selection-card-container">
                <h1>Snorkeling Packages</h1>
                <p className="subtitle">How many packages do you want to list for this activity?</p>

                <div className="activity-options">
                    {activityTypes.map((type) => (
                        <div
                            key={type.id}
                            className={`selection-item ${selectedType === type.id ? 'active' : ''}`}
                            onClick={() => setSelectedType(type.id)}
                        >
                            <div className="icon-box">
                                {type.icon}
                            </div>
                            <div className="text-content">
                                <h3>{type.title}</h3>
                                <p>{type.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bottom-nav">
                    <button className="btn btn-back" onClick={() => navigate(-1)}>Back</button>
                    <button
                        className="btn btn-next"
                        onClick={() => {
                            if (selectedType === '1_package') {
                                navigate('/partner/activity-details');
                            } else {
                                navigate('/partner/multiple-packages');
                            }
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerSnorkeling;
