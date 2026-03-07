import React from 'react';

/**
 * Komponen Footer
 * Menampilkan maklumat lokasi (Jeti Marang), waktu operasi, dan media sosial.
 */
const Footer = () => {


  return (
    <footer style={{ textAlign: 'center', marginTop: '50px', padding: '30px', backgroundColor: '#fff', borderTop: '1px solid #eee', color: '#757575' }}>
      <h2>Location and Hours</h2>
      <address style={{ fontStyle: 'normal', marginBottom: '10px' }}>
        Jeti Marang Pulau Kapas, Terengganu
      </address>
      <div style={{ fontSize: '13px' }}>
        Monday through Sunday: 8:00 a.m. to 6:00 p.m.
      </div>
    </footer>
  );
};

export default Footer;
