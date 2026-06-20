import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import logo secara terus untuk memudahkan pengurusan aset dalam Webpack/Vite
import logo from '../../assets/images/logo/logo.svg';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <header className="main-header">
      <div className="nav-container">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Iland Logo" className="logo-img" width="30" height="30" />
          <span className="company-name">ilaand</span>
        </Link>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <nav className={`auth-nav ${isMenuOpen ? 'open' : ''}`}>
          <div className={`auth-links ${isMenuOpen ? 'menu-open' : ''}`}>
            <Link to="/kapas-island-day-trips" className="btn btn-text nav-item">Kapas</Link>
            <Link to="/redang-island-day-trips" className="btn btn-text nav-item">Redang</Link>
            <Link to="/perhentian-island-day-trips" className="btn btn-text nav-item">Perhentian</Link>
            <Link to="/about" className="btn btn-text nav-item-about">About Us</Link>
            <Link to="/auth" className="btn signin-btn nav-item-signin">Sign In</Link>
            <Link 
              to="/auth?mode=register" 
              className="btn create-btn nav-item-create"
              onClick={() => {
                if (window.gtag) {
                  window.gtag('event', 'click_register', {
                    'event_category': 'User Engagement',
                    'event_label': 'Register Button'
                  });
                }
              }}
            >
              Register
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
