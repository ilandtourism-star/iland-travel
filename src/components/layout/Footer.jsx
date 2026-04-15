import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * Displays company information, quick links, island activities, and contact details.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <style>{`
        .footer-container {
          background: #1a1a1a;
          color: #ffffff;
          padding: 60px 20px 20px;
          margin-top: 80px;
          font-family: 'Poppins', sans-serif;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h3 {
          color: #1ABC9C;
          font-size: 1.1rem;
          margin-bottom: 25px;
          font-weight: 700;
          position: relative;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .footer-section h3::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 30px;
          height: 2px;
          background: #1ABC9C;
        }

        .footer-section p {
          color: #cccccc;
          font-size: 0.9rem;
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-section ul li {
          margin-bottom: 12px;
        }

        .footer-section ul li a {
          color: #cccccc;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer-section ul li a:hover {
          color: #1ABC9C;
          transform: translateX(5px);
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .social-icon {
          width: 35px;
          height: 35px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .social-icon:hover {
          background: #1ABC9C;
          transform: translateY(-3px);
          color: white;
        }

        .contact-info li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #cccccc;
          font-size: 0.9rem;
          margin-bottom: 15px !important;
        }

        .contact-info i {
          color: #1ABC9C;
          margin-top: 4px;
          width: 16px;
          text-align: center;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-bottom p {
          color: #888888;
          font-size: 0.85rem;
          margin: 0;
        }

        .footer-logo {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1ABC9C;
          margin-bottom: 15px;
          display: block;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 40px 20px 20px;
            text-align: center;
          }
          .footer-section h3::after {
            left: 50%;
            transform: translateX(-50%);
          }
          .social-links {
            justify-content: center;
          }
          .contact-info li {
            justify-content: center;
          }
          .footer-bottom {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="footer-content">
        {/* Column 1: Brand & Intro */}
        <div className="footer-section">
          <Link to="/" className="footer-logo">ILAND</Link>
          <p>
            Your primary gateway to island paradises in Terengganu. We provide the best
            boat services and tour packages for an unforgettable vacation experience.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-tiktok"></i></a>
            <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search Activities</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/auth">Sign In</Link></li>
            <li><Link to="/auth?mode=register">Register Account</Link></li>
          </ul>
        </div>

        {/* Column 3: Popular Destinations */}
        <div className="footer-section">
          <h3>Destinations</h3>
          <ul>
            <li><Link to="/kapas-island-day-trips">Kapas Island</Link></li>
            <li><Link to="/redang-island-day-trips">Redang Island</Link></li>
            <li><Link to="/perhentian-island-day-trips">Perhentian Island</Link></li>
            <li><Link to="/kapas-island-packages">Exclusive Packages</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>Marang Jetty, 21600 Marang,<br />Terengganu, Malaysia</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+60 14-708 1346 </span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>ilandtourism@gmail.com</span>
            </li>
            <li>
              <i className="fas fa-clock"></i>
              <span>Monday - Sunday: 8:00 AM - 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Iland Tourism. All Rights Reserved.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/terms" style={{ color: '#888888', fontSize: '0.85rem' }}>Terms & Conditions</Link>
          <Link to="/privacy" style={{ color: '#888888', fontSize: '0.85rem' }}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
