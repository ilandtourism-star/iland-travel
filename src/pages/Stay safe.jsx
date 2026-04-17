import React, { useState } from 'react';

const StaySafe = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email sent:", email);
        // Add API logic or next page navigation here
    };

    return (
        <div className="content-container">
            <div className="alert-box">
                Stay safe: Check the address bar to ensure you are on the real site before logging in.
            </div>

            <h1>Sign in or create an account</h1>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '20px' }}>
                For security, please sign in to access your information
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ textAlign: 'left' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div style={{ marginBottom: '20px', fontSize: '0.9em' }}>
                        <input type="checkbox" id="keep-signed" />
                        <label htmlFor="keep-signed"> Keep me signed in</label>
                    </div>

                    <button type="submit" className="btn create-btn">
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StaySafe;
