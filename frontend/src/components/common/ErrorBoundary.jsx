import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: 'var(--paper)',
          color: 'var(--ink)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'var(--font-sans)'
        }}>
          <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Something went wrong.</h1>
            <p style={{ marginBottom: '2rem' }}>An unexpected error occurred in the application.</p>
            <button 
              className="btn-filled"
              onClick={() => window.location.reload()}
              style={{ marginBottom: '2rem' }}
            >
              Reload page
            </button>
            <details style={{ textAlign: 'left', background: 'rgba(0,0,0,0.05)', padding: '1rem', borderRadius: '4px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error details</summary>
              <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
