import React, { useState } from 'react';

/**
 * Komponen Accordion
 * @param {string} title - Tajuk yang dipaparkan pada header
 * @param {node} children - Kandungan yang akan disembunyikan/dipaparkan
 * @param {string} id - ID unik untuk tujuan CSS atau scroll
 */
const Accordion = ({ title, children, id }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fungsi untuk tukar status buka/tutup
  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div id={id} className="accordion-wrapper">
      {/* Bahagian Header - Sentiasa kelihatan */}
      <div 
        className={`accordion-header ${isOpen ? 'active' : ''}`} 
        onClick={toggleAccordion}
      >
        <h3>{title}</h3>
        <span className={`arrow-icon ${isOpen ? 'rotate' : ''}`}>
          &#9660;
        </span>
      </div>

      {/* Bahagian Kandungan - Hanya muncul jika isOpen = true */}
      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
