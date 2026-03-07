import React from 'react';
import { Outlet } from 'react-router-dom';
import PartnerNavbar from './PartnerNavbar';

const PartnerLayout = () => {
    return (
        <div className="partner-layout-container">
            <PartnerNavbar />
            <div className="partner-content-wrapper">
                <Outlet />
            </div>
            <div className="partner-footer">
                <p>&copy; 2025 Iland Platform. All rights reserved.</p>
            </div>
        </div>
    );
};

export default PartnerLayout;
