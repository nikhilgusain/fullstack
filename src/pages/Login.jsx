import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, ShieldAlert, AlertTriangle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in both email and password.');
      return;
    }

    try {
      await login(email, password);
      console.log('[Login Page] Login request resolved. Navigating to Dashboard.');
      navigate('/');
    } catch (err) {
      // Error will be caught and updated in AuthContext, also caught here
      console.error('[Login Page] Login action failed:', err.message);
    }
  };

  return (
    <div className="login-container">
      {/* Dynamic glow blobs */}
      <div className="login-bg-glow-1" />
      <div className="login-bg-glow-2" />

      <div className="glass-card login-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <Layers size={36} />
          </div>
          <h2>Sign in to <span className="text-gradient">TaskFlow</span></h2>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Simulated JWT Token Authentication Dashboard</p>
        </div>

        {/* Informative credentials box */}
        <div className="login-credentials-info">
          <p style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-primary)' }}>Test Credentials:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div>Admin: <code style={{ fontSize: '0.75rem' }}>admin@taskflow.com</code> / <code>admin123</code></div>
            <div>Developer: <code style={{ fontSize: '0.75rem' }}>developer@taskflow.com</code> / <code>dev123</code></div>
          </div>
        </div>

        {(error || localError) && (
          <div className="login-error-alert animate-fade-in">
            <ShieldAlert size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input 
              id="login-email"
              type="email" 
              className="form-input" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
            </div>
            <input 
              id="login-password"
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            style={{ width: '100%', padding: '0.8rem' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ borderTopColor: '#fff' }}></span>
                <span>Authenticating...</span>
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
