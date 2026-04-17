import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App.jsx'

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#fff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏝️</div>
          <h1 style={{ color: '#2a2a2e', fontSize: '28px', marginBottom: '16px' }}>Oops, something unexpected happened!</h1>
          <p style={{ color: '#737373', fontSize: '16px', maxWidth: '500px', lineHeight: '1.6', marginBottom: '32px' }}>
            Don't worry, our safety system has caught this error. Try refreshing the page or returning home.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{ padding: '12px 24px', backgroundColor: '#f8f9fa', color: '#2a2a2e', border: '1px solid #dce0e4', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
            >
              Return Home
            </button>
          </div>
          {process.env.NODE_ENV !== 'production' && (
            <div style={{ marginTop: '40px', textAlign: 'left', width: '100%', maxWidth: '800px', padding: '20px', background: '#f5f5f5', borderRadius: '8px', fontSize: '12px' }}>
              <h3 style={{ marginBottom: '8px' }}>Developer Info:</h3>
              <details style={{ whiteSpace: 'pre-wrap', color: '#666' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </StrictMode>,
)
