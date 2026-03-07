import React from 'react';

/**
 * Komponen ContactForm
 * Digunakan untuk mengumpul maklumat pelanggan bagi tempahan aktiviti pulau.
 */
const ContactForm = ({ formData = {}, onChange }) => {
  return (
    <div className="card contact-card">
      <h2 className="card-title">Contact Information</h2>

      <div className="info-box">
        <i className="fas fa-info-circle"></i>
        <span>We will send a confirmation to the email address you provide below.</span>
      </div>

      <form className="booking-form">
        {/* Baris 1: Nama */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstname" className="required">First Name</label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              value={formData.firstname || ''}
              onChange={onChange}
              placeholder="e.g. Ali"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname" className="required">Last Name</label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname || ''}
              onChange={onChange}
              placeholder="e.g. Bin Abu"
              required
            />
          </div>
        </div>

        {/* Baris 2: Emel */}
        <div className="form-group">
          <label htmlFor="email" className="required">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={onChange}
            placeholder="email@example.com"
            required
          />
        </div>

        {/* Baris 3: Telefon */}
        <div className="form-row">
          <div className="form-group code-group">
            <label htmlFor="code" className="required">Kod</label>
            <input
              id="code"
              type="tel"
              name="code"
              value={formData.code || '+60'}
              onChange={onChange}
              placeholder="+60"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile_number" className="required">Phone Number</label>
            <input
              id="mobile_number"
              type="tel"
              name="mobile_number"
              value={formData.mobile_number || ''}
              onChange={onChange}
              placeholder="123456789"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
