import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const NotFound = () => {
    return (
        <div className="not-found-page" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            padding: '40px 20px',
            fontFamily: 'Poppins, sans-serif'
        }}>
            <SEO 
                title="Page Not Found | ilaand"
                description="The island you are looking for has drifted away. Let's get you back to shore."
            />

            <div className="not-found-icon" style={{ fontSize: '6rem', color: '#0ea5e9', marginBottom: '24px' }}>
                <i className="fas fa-map-marked-alt"></i>
            </div>
            
            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                You've Drifted Too Far!
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '500px', marginBottom: '40px', lineHeight: '1.6' }}>
                The page you are looking for doesn't exist or has moved to a secret location. Let's navigate you back to the main island.
            </p>
            
            <Link to="/" style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)',
                transition: 'transform 0.3s ease'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-home" style={{ marginRight: '10px' }}></i> Return to Shore
            </Link>

            <div style={{ marginTop: '60px', color: '#94a3b8', fontSize: '0.9rem' }}>
                <p>Mistakes happen. If you think this is a bug, please contact our Ocean Navigators.</p>
            </div>
        </div>
    );
};

export default NotFound;
