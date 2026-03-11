import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Komponen Footer
 * Menampilkan maklumat syarikat, pautan pantas, aktiviti pulau, dan maklumat perhubungan.
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
        {/* Kolum 1: Brand & Intro */}
        <div className="footer-section">
          <Link to="/" className="footer-logo">ILAND</Link>
          <p>
            Gerbang utama anda ke syurga pulau di Terengganu. Kami menyediakan perkhidmatan 
            bot dan pakej pelancongan terbaik untuk pengalaman percutian yang tidak dapat dilupakan.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-tiktok"></i></a>
            <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>

        {/* Kolum 2: Pautan Pantas */}
        <div className="footer-section">
          <h3>Pautan Pantas</h3>
          <ul>
            <li><Link to="/">Laman Utama</Link></li>
            <li><Link to="/search">Cari Aktiviti</Link></li>
            <li><Link to="/about">Tentang Kami</Link></li>
            <li><Link to="/signin">Log Masuk</Link></li>
            <li><Link to="/signup">Daftar Akaun</Link></li>
          </ul>
        </div>

        {/* Kolum 3: Destinasi Popular */}
        <div className="footer-section">
          <h3>Destinasi</h3>
          <ul>
            <li><Link to="/kapas-island-day-trips">Pulau Kapas</Link></li>
            <li><Link to="/redang-island-day-trips">Pulau Redang</Link></li>
            <li><Link to="/perhentian-island-day-trips">Pulau Perhentian</Link></li>
            <li><Link to="/kapas-island-packages">Pakej Eksklusif</Link></li>
          </ul>
        </div>

        {/* Kolum 4: Hubungi Kami */}
        <div className="footer-section">
          <h3>Hubungi Kami</h3>
          <ul className="contact-info">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>Jeti Marang, 21600 Marang,<br />Terengganu, Malaysia</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+60 12-345 6789</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>hello@ilandtourism.com</span>
            </li>
            <li>
              <i className="fas fa-clock"></i>
              <span>Isnin - Ahad: 8:00 AM - 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Iland Tourism. Hak Cipta Terpelihara.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/terms" style={{ color: '#888888', fontSize: '0.85rem' }}>Terma & Syarat</Link>
          <Link to="/privacy" style={{ color: '#888888', fontSize: '0.85rem' }}>Dasar Privasi</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
