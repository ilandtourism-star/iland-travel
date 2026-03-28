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
          <Link to="/about" className="btn btn-text nav-item-about">About Us</Link>
          <Link to="/auth" className="btn signin-btn nav-item-signin">Sign In</Link>
          <Link to="/auth?mode=register" className="btn create-btn nav-item-create">Register</Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
