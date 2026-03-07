import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PartnerMultiplePackages = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([
        { id: 1, name: 'Basic Package (A)', status: 'Draft' },
        { id: 2, name: 'Premium Package (B)', status: 'Draft' }
    ]);

    const addPackage = () => {
        const newId = packages.length + 1;
        setPackages([...packages, { id: newId, name: `New Package (${newId})`, status: 'Draft' }]);
    };

    const removePackage = (id) => {
        setPackages(packages.filter(pkg => pkg.id !== id));
    };

    return (
        <div className="partner-selection-wrapper">
            <style>{`
                .partner-selection-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 60px 20px;
                    font-family: 'Poppins', sans-serif;
                }
                .management-container {
                    max-width: 800px;
                    width: 100%;
                }
                .header-section {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .header-section h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 10px;
                }
                .header-section p {
                    color: #666;
                    font-size: 1.1rem;
                }
                .package-list {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    overflow: hidden;
                    margin-bottom: 30px;
                }
                .package-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 30px;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background 0.2s;
                }
                .package-item:last-child {
                    border-bottom: none;
                }
                .package-item:hover {
                    background: #fafafa;
                }
                .package-info h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #2a2a2e;
                }
                .package-info span {
                    font-size: 0.85rem;
                    color: #999;
                    background: #f0f0f0;
                    padding: 2px 8px;
                    border-radius: 4px;
                    margin-top: 4px;
                    display: inline-block;
                }
                .package-actions {
                    display: flex;
                    gap: 12px;
                }
                .btn-manage {
                    background: #5392f9;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: 0.3s;
                }
                .btn-manage:hover {
                    background: #367af6;
                }
                .btn-delete {
                    background: white;
                    color: #e74c3c;
                    border: 1px solid #e74c3c;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: 0.3s;
                }
                .btn-delete:hover {
                    background: #fff5f5;
                }
                .add-section {
                    text-align: center;
                }
                .btn-add {
                    background: white;
                    color: #5392f9;
                    border: 2px dashed #5392f9;
                    padding: 15px 30px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 700;
                    width: 100%;
                    transition: 0.3s;
                }
                .btn-add:hover {
                    background: #f0f6ff;
                    transform: translateY(-2px);
                }
                .bottom-nav {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 50px;
                }
                .btn-nav {
                    padding: 12px 40px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .btn-back {
                    background: white;
                    border: 1px solid #ccc;
                    color: #666;
                }
                .btn-next {
                    background: #5392f9;
                    color: white;
                    border: none;
                }
                .btn-next:hover {
                    background: #367af6;
                    box-shadow: 0 4px 12px rgba(83, 146, 249, 0.3);
                }
            `}</style>

            <div className="management-container">
                <div className="header-section">
                    <h1>Manage Multiple Packages</h1>
                    <p>Register more than two packages (suitable for large operations).</p>
                </div>

                <div className="package-list">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="package-item">
                            <div className="package-info">
                                <h3>{pkg.name}</h3>
                                <span>{pkg.status}</span>
                            </div>
                            <div className="package-actions">
                                <button className="btn-manage" onClick={() => navigate('/partner/activity-details')}>Edit Package</button>
                                <button className="btn-delete" onClick={() => removePackage(pkg.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="add-section">
                    <button className="btn-add" onClick={addPackage}>
                        <i className="fas fa-plus" style={{ marginRight: '10px' }}></i>
                        Add New Package
                    </button>
                </div>

                <div className="bottom-nav">
                    <button className="btn-nav btn-back" onClick={() => navigate(-1)}>Back</button>
                    <button className="btn-nav btn-next" onClick={() => navigate('/partner/activity-details')}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default PartnerMultiplePackages;
