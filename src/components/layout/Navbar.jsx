import React from 'react';
import { Link } from 'react-router-dom';
// Import logo secara terus untuk memudahkan pengurusan aset dalam Webpack/Vite
import logo from '../../assets/images/logo/logo.svg';

const Navbar = () => {
  return (
    <header className="main-header">
      <Link to="/" className="logo-container">
        {/* Gunakan logo yang diimport atau path statik yang konsisten */}
        <img src={logo} alt="Iland Logo" className="logo-img" width="30" height="30" />
        <span className="company-name">Iland</span>
      </Link>

      <nav className="auth-nav">
        <div className="auth-links">
          <Link to="/list-your-activity" className="btn create-btn" style={{ marginRight: '10px' }}>List your activity</Link>
          <Link to="/about" className="btn btn-text" style={{ marginRight: '10px' }}>About Us</Link>
          <Link to="/auth" className="btn signin-btn">Sign In</Link>
          <Link to="/auth?mode=register" className="btn create-btn">Create Account</Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
